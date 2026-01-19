
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryItem } from '../../core/models/inventory.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { formatNum } from '../../shared/utils/utils';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

type CalcMode = 'molar' | 'dilution' | 'spiking' | 'serial' | 'mix';
type SystemMode = 'sandbox' | 'real';

// Unit Constants
const CONC_UNITS = [
    { val: 'M', factor: 1, label: 'M (Molar)' },
    { val: 'mM', factor: 0.001, label: 'mM' },
    { val: 'ppm', factor: 0.001, label: 'ppm (mg/L)' },
    { val: '%', factor: 10, label: '%' },
    { val: 'mg/ml', factor: 1, label: 'mg/mL' }
];

const VOL_UNITS = [
    { val: 'l', factor: 1, label: 'L' },
    { val: 'ml', factor: 0.001, label: 'mL' },
    { val: 'ul', factor: 0.000001, label: 'µL' }
];

const MASS_UNITS = [
    { val: 'g', factor: 1, label: 'g' },
    { val: 'mg', factor: 0.001, label: 'mg' },
    { val: 'kg', factor: 1000, label: 'kg' },
    { val: 'ug', factor: 0.000001, label: 'µg' }
];

interface SerialPoint {
    conc: number;
    vStock: number; // calculated
    vSolvent: number; // calculated
}

interface MixRow {
    id: string;
    name: string;
    stockConc: number;
    targetConc: number;
    unit: string; // Target unit
    invItem: InventoryItem | null;
}

@Component({
  selector: 'app-smart-prep',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col fade-in pb-10 font-sans text-slate-800">
        
        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 shrink-0">
            <div>
                <h2 class="text-2xl font-black flex items-center gap-3 text-slate-800">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg">
                        <i class="fa-solid fa-flask-vial"></i>
                    </div>
                    Trạm Pha Chế
                </h2>
                <p class="text-xs font-medium text-slate-500 mt-1 ml-1">Công cụ tính toán & Tương tác kho hóa chất</p>
            </div>

            <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button (click)="setSystemMode('sandbox')" 
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2"
                        [class]="systemMode() === 'sandbox' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                    <i class="fa-solid fa-calculator"></i> Nháp (Sandbox)
                </button>
                <button (click)="setSystemMode('real')" 
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2"
                        [class]="systemMode() === 'real' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'"
                        [class.opacity-60]="!auth.canEditInventory() && systemMode() !== 'real'"
                        [title]="auth.canEditInventory() ? 'Chế độ Thực (Trừ kho)' : 'Yêu cầu quyền Sửa Kho'">
                    <i class="fa-solid fa-link"></i> Kho (Real)
                    @if(!auth.canEditInventory()) { <i class="fa-solid fa-lock text-[9px]"></i> }
                </button>
            </div>
        </div>

        <div class="flex-1 flex flex-col xl:flex-row gap-6 min-h-0 relative z-10">
            
            <!-- LEFT PANEL: CONFIG -->
            <div class="w-full xl:w-5/12 bg-white rounded-3xl shadow-soft-xl border border-slate-100 flex flex-col overflow-hidden">
                
                <!-- Mode Tabs -->
                <div class="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                    @for (m of modes; track m.id) {
                        <button (click)="setCalcMode(m.id)" 
                                class="flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 whitespace-nowrap flex flex-col items-center gap-1"
                                [class]="calcMode() === m.id ? 'border-' + m.color + '-500 text-' + m.color + '-600 bg-' + m.color + '-50/20' : 'border-transparent text-slate-400'">
                            <i class="fa-solid {{m.icon}} text-sm mb-0.5"></i> {{m.label}}
                        </button>
                    }
                </div>

                <div class="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    
                    <!-- CHEMICAL SELECTOR (Real Mode & Not Mix) -->
                    @if (systemMode() === 'real' && calcMode() !== 'mix') {
                        <div class="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-2 animate-slide-up relative">
                            <label class="text-[10px] font-bold text-purple-800 uppercase flex items-center gap-2">
                                <i class="fa-solid fa-search"></i> Chọn Hóa chất (Trừ kho)
                            </label>
                            
                            @if (!selectedItem()) {
                                <div class="relative">
                                    <input [ngModel]="searchTerm()" (ngModelChange)="onSearch($event)" 
                                           placeholder="Nhập tên, mã số, hoặc công thức..." 
                                           class="w-full pl-9 pr-4 py-3 rounded-xl border-none ring-1 ring-purple-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-slate-700 placeholder-purple-300 shadow-sm">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-purple-300"></i>
                                    
                                    @if (isSearching()) {
                                        <div class="absolute right-3 top-3 text-purple-500"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
                                    }

                                    <!-- Dropdown -->
                                    @if (searchResults().length > 0) {
                                        <div class="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50 custom-scrollbar">
                                            @for (item of searchResults(); track item.id) {
                                                <div (click)="selectGlobalItem(item)" class="p-3 hover:bg-purple-50 cursor-pointer border-b border-slate-50 last:border-0 group transition">
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
                                <div class="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-purple-200 shadow-sm">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg shrink-0">
                                        <i class="fa-solid fa-flask"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-bold text-slate-800 truncate">{{selectedItem()?.name}}</div>
                                        <div class="text-[11px] text-slate-500 flex items-center gap-2">
                                            <span class="bg-slate-100 px-1.5 rounded font-mono">{{selectedItem()?.id}}</span>
                                            <span>Tồn: <b class="text-emerald-600">{{formatNum(selectedItem()?.stock)}} {{selectedItem()?.unit}}</b></span>
                                        </div>
                                    </div>
                                    <button (click)="clearSelection()" class="w-8 h-8 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition flex items-center justify-center">
                                        <i class="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            }
                        </div>
                    }

                    <!-- 1. MOLAR (Pha rắn) -->
                    @if (calcMode() === 'molar') {
                        <div class="card-input border-blue-100">
                            <div class="card-header bg-blue-50 text-blue-700"><i class="fa-solid fa-weight-hanging"></i> Thông số Chất tan</div>
                            <div class="p-4 space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="label">Phân tử lượng (MW)</label>
                                        <div class="input-wrapper">
                                            <input type="number" [(ngModel)]="mw" class="input-field text-center" placeholder="e.g. 58.44">
                                            <span class="unit-badge">g/mol</span>
                                        </div>
                                    </div>
                                    <div class="space-y-1">
                                        <label class="label">Độ tinh khiết</label>
                                        <div class="input-wrapper">
                                            <input type="number" [(ngModel)]="purity" class="input-field text-center text-blue-600 font-bold" placeholder="100">
                                            <span class="unit-badge">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card-input border-blue-100">
                            <div class="card-header bg-blue-50 text-blue-700"><i class="fa-solid fa-bullseye"></i> Đích mong muốn</div>
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ đích</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetConc" class="input-field flex-1" placeholder="C">
                                        <select [(ngModel)]="targetConcUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Thể tích đích</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="V">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- 2. DILUTION (Pha loãng) -->
                    @if (calcMode() === 'dilution') {
                        <div class="card-input border-orange-100">
                            <div class="card-header bg-orange-50 text-orange-700"><i class="fa-solid fa-flask"></i> Thông số Gốc & Đích</div>
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Gốc (Stock)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-orange-600" placeholder="C1">
                                        <select [(ngModel)]="concUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Đích (Target)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetConc" class="input-field flex-1" placeholder="C2">
                                        <div class="w-24 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500">{{concUnit()}}</div>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Thể tích Đích (V2)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="V2">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- 3. SPIKING -->
                    @if (calcMode() === 'spiking') {
                        <div class="card-input border-emerald-100">
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Chuẩn (Stock)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-emerald-600" placeholder="C_stock">
                                        <select [(ngModel)]="concUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Thêm (Added)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetConc" class="input-field flex-1" placeholder="C_add">
                                        <div class="w-24 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500">{{concUnit()}}</div>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Thể tích Mẫu (V_sample)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="V_sample">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- 4. SERIAL DILUTION (Updated UI) -->
                    @if (calcMode() === 'serial') {
                        <div class="card-input border-fuchsia-100">
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Gốc (Stock)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-fuchsia-600" placeholder="C1">
                                        <select [(ngModel)]="concUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Thể tích định mức mỗi điểm (V_point)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="V">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Dynamic List for Points -->
                                <div class="space-y-2 pt-2 border-t border-slate-100">
                                    <div class="flex justify-between items-center">
                                        <label class="label mb-0">Các điểm chuẩn</label>
                                        <button (click)="addSerialPoint()" class="text-[10px] font-bold bg-fuchsia-50 text-fuchsia-700 px-2 py-1 rounded hover:bg-fuchsia-100 transition">+ Thêm điểm</button>
                                    </div>
                                    <div class="space-y-2">
                                        <!-- FIX: Iterate over signal value and use update helper -->
                                        @for (pt of serialPoints(); track $index) {
                                            <div class="flex gap-2 items-center animate-slide-up">
                                                <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{{$index + 1}}</div>
                                                <input type="number" 
                                                       [ngModel]="pt" 
                                                       (ngModelChange)="updateSerialPoint($index, $event)"
                                                       class="input-field py-1.5 text-sm" 
                                                       placeholder="Conc">
                                                <div class="text-xs font-bold text-slate-400 w-8">{{concUnit()}}</div>
                                                <button (click)="removeSerialPoint($index)" class="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-red-500 rounded-full hover:bg-red-50 transition"><i class="fa-solid fa-times"></i></button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- 5. MIXER (Table UI) -->
                    @if (calcMode() === 'mix') {
                        <div class="card-input border-indigo-100">
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Tổng thể tích hỗn hợp (V_final)</label>
                                    <div class="flex gap-2">
                                        <input type="number" [(ngModel)]="targetVol" class="input-field flex-1 text-center font-black text-indigo-600 text-lg" placeholder="100">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Mix Table -->
                                <div class="pt-2">
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="label mb-0">Thành phần</label>
                                        <button (click)="addMixRow()" class="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition">+ Thêm chất</button>
                                    </div>
                                    
                                    <div class="space-y-2">
                                        @for (row of mixItems(); track row.id; let i = $index) {
                                            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 relative group transition hover:border-indigo-300 hover:shadow-sm">
                                                <button (click)="removeMixRow(i)" class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-slate-300 hover:text-red-500 rounded-full hover:bg-white transition"><i class="fa-solid fa-times"></i></button>
                                                
                                                <!-- Row Header: Name Search -->
                                                <div class="mb-2 pr-6 relative">
                                                    @if(systemMode() === 'real' && !row.invItem) {
                                                        <input placeholder="Tìm chất trong kho..." 
                                                               (input)="onSearchMix(i, $event)"
                                                               class="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 placeholder-slate-400 focus:ring-0">
                                                        <!-- Dropdown -->
                                                        @if(activeMixSearchIndex() === i && searchResults().length > 0) {
                                                            <div class="absolute top-full left-0 w-full z-20 bg-white shadow-xl rounded-lg max-h-40 overflow-y-auto mt-1 border border-slate-100">
                                                                @for(res of searchResults(); track res.id) {
                                                                    <div (click)="selectMixItem(i, res)" class="p-2 hover:bg-indigo-50 cursor-pointer text-xs border-b border-slate-50">
                                                                        <div class="font-bold truncate">{{res.name}}</div>
                                                                        <div class="text-[9px] text-slate-400">Tồn: {{res.stock}} {{res.unit}}</div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        }
                                                    } @else if (row.invItem) {
                                                        <div class="flex items-center gap-2">
                                                            <span class="text-xs font-bold text-indigo-700 truncate flex-1">{{row.invItem.name}}</span>
                                                            <button (click)="clearMixItem(i)" class="text-[10px] text-slate-400 hover:text-red-500"><i class="fa-solid fa-rotate-left"></i></button>
                                                        </div>
                                                    } @else {
                                                        <!-- FIX: Use safe update method for name -->
                                                        <input [ngModel]="row.name" 
                                                               (ngModelChange)="updateMixItem(i, 'name', $event)" 
                                                               class="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 placeholder-slate-400 focus:ring-0" 
                                                               placeholder="Tên chất {{i+1}}">
                                                    }
                                                </div>

                                                <!-- Row Inputs -->
                                                <div class="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label class="text-[8px] font-bold text-slate-400 uppercase">Stock Conc</label>
                                                        <!-- FIX: Safe update for stockConc -->
                                                        <input type="number" 
                                                               [ngModel]="row.stockConc" 
                                                               (ngModelChange)="updateMixItem(i, 'stockConc', $event)"
                                                               class="w-full border border-slate-200 rounded px-2 py-1 text-xs text-center font-bold" 
                                                               placeholder="C_stock">
                                                    </div>
                                                    <div class="flex gap-1">
                                                        <div class="flex-1">
                                                            <label class="text-[8px] font-bold text-slate-400 uppercase">Target</label>
                                                            <!-- FIX: Safe update for targetConc -->
                                                            <input type="number" 
                                                                   [ngModel]="row.targetConc" 
                                                                   (ngModelChange)="updateMixItem(i, 'targetConc', $event)"
                                                                   class="w-full border border-slate-200 rounded px-2 py-1 text-xs text-center font-bold" 
                                                                   placeholder="C_target">
                                                        </div>
                                                        <div class="w-16">
                                                            <label class="text-[8px] font-bold text-slate-400 uppercase">Unit</label>
                                                            <!-- FIX: Safe update for unit -->
                                                            <select [ngModel]="row.unit" 
                                                                    (ngModelChange)="updateMixItem(i, 'unit', $event)"
                                                                    class="w-full border border-slate-200 rounded px-1 py-1 text-[10px] font-bold bg-white h-[26px]">
                                                                @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- RIGHT PANEL: RESULTS -->
            <div class="flex-1 flex flex-col gap-6">
                
                <div class="bg-white rounded-3xl shadow-soft-xl border border-slate-100 overflow-hidden relative flex-1 flex flex-col">
                    <!-- Color Bar -->
                    <div class="absolute top-0 left-0 w-full h-1.5 transition-colors duration-500" 
                         [class.bg-blue-500]="calcMode() === 'molar'"
                         [class.bg-orange-500]="calcMode() === 'dilution'"
                         [class.bg-emerald-500]="calcMode() === 'spiking'"
                         [class.bg-fuchsia-500]="calcMode() === 'serial'"
                         [class.bg-indigo-500]="calcMode() === 'mix'">
                    </div>

                    <div class="p-6 md:p-8 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                        <div class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">Kết quả tính toán</div>
                        
                        <!-- SINGLE VALUE MODES -->
                        @if (['molar', 'dilution', 'spiking'].includes(calcMode())) {
                            <div class="text-center space-y-4 animate-scale-in">
                                <div class="relative inline-block">
                                    <h1 class="text-6xl md:text-7xl font-black tracking-tight text-slate-800 tabular-nums">
                                        {{ formatNum(resultValue()) }}
                                    </h1>
                                    <span class="absolute -right-8 top-0 text-lg font-bold text-slate-400">{{ resultUnit() }}</span>
                                </div>
                                <p class="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {{ resultDescription() }}
                                </p>
                            </div>
                        }

                        <!-- SERIAL DILUTION TABLE -->
                        @if (calcMode() === 'serial') {
                            <div class="w-full animate-slide-up">
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-fuchsia-600 bg-fuchsia-50 uppercase font-bold">
                                        <tr>
                                            <th class="px-4 py-3 rounded-l-lg">Điểm chuẩn</th>
                                            <th class="px-4 py-3 text-right">Lượng Hút (Stock)</th>
                                            <th class="px-4 py-3 text-right rounded-r-lg">Thêm Dung môi</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for (pt of serialResult(); track $index) {
                                            <tr class="hover:bg-fuchsia-50/30 transition">
                                                <td class="px-4 py-3 font-bold text-slate-700">{{pt.conc}} {{concUnit()}}</td>
                                                <td class="px-4 py-3 text-right font-mono font-bold text-fuchsia-600">{{formatNum(pt.vStock)}} µL</td>
                                                <td class="px-4 py-3 text-right text-slate-500">{{formatNum(pt.vSolvent)}} {{targetVolUnit()}}</td>
                                            </tr>
                                        }
                                        <tr class="bg-slate-50 font-bold border-t border-slate-200">
                                            <td class="px-4 py-3 text-slate-500">TỔNG STOCK CẦN</td>
                                            <td class="px-4 py-3 text-right text-fuchsia-700 text-lg">{{formatNum(serialTotalStock())}} µL</td>
                                            <td class="px-4 py-3"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        }

                        <!-- MIX TABLE -->
                        @if (calcMode() === 'mix') {
                            <div class="w-full animate-slide-up">
                                <div class="mb-6 text-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <span class="text-xs text-indigo-400 uppercase font-bold">Dung môi thêm vào (QS):</span>
                                    <div class="text-3xl font-black text-indigo-700">{{formatNum(mixResult().solventVol)}} <span class="text-sm font-normal">{{targetVolUnit()}}</span></div>
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
                                            <tr class="hover:bg-indigo-50/30 transition">
                                                <td class="px-3 py-2 font-bold text-slate-700 truncate max-w-[150px]">{{res.name}}</td>
                                                <td class="px-3 py-2 text-right font-mono font-bold text-indigo-600">{{formatNum(res.vStock)}} {{targetVolUnit()}}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }

                        <!-- REAL MODE STOCK STATUS -->
                        @if (systemMode() === 'real' && (selectedItem() || calcMode() === 'serial' || calcMode() === 'mix')) {
                            <div class="w-full max-w-sm mx-auto mt-auto pt-6">
                                <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                                    
                                    @if (calcMode() === 'mix') {
                                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">Trạng thái kho (Hỗn hợp)</div>
                                        <div class="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                            @for (status of mixStockStatus(); track status.name) {
                                                <div class="flex justify-between items-center text-xs">
                                                    <span class="truncate max-w-[150px] font-medium text-slate-700">{{status.name}}</span>
                                                    @if(status.ok) {
                                                        <span class="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1"><i class="fa-solid fa-check"></i> Đủ</span>
                                                    } @else {
                                                        <span class="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded flex items-center gap-1"><i class="fa-solid fa-xmark"></i> Thiếu</span>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    } @else {
                                        <div class="flex justify-between items-end mb-2">
                                            <div>
                                                <div class="text-[10px] font-bold text-slate-400 uppercase">Tồn kho hiện tại</div>
                                                <div class="text-sm font-bold text-slate-800">{{ formatNum(selectedItem()?.stock || 0) }} {{ selectedItem()?.unit || ''}}</div>
                                            </div>
                                            @if(canFulfill()) {
                                                <span class="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded"><i class="fa-solid fa-check-circle"></i> Đủ hàng</span>
                                            } @else {
                                                <span class="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded"><i class="fa-solid fa-circle-exclamation"></i> Thiếu hàng</span>
                                            }
                                        </div>
                                        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                            <div class="h-full rounded-full transition-all duration-500"
                                                 [style.width.%]="stockPercentage()"
                                                 [class.bg-emerald-500]="canFulfill()"
                                                 [class.bg-red-500]="!canFulfill()">
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <!-- FOOTER ACTIONS -->
                    <div class="p-5 bg-slate-50 border-t border-slate-200 flex gap-3 shrink-0">
                        <button class="flex-1 bg-white border border-slate-300 text-slate-600 font-bold py-3.5 rounded-xl shadow-sm hover:bg-slate-50 transition active:scale-95 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-print text-slate-400"></i> In Nhãn
                        </button>
                        
                        @if (systemMode() === 'real') {
                            <button (click)="confirmTransaction()" 
                                    [disabled]="!canFulfill() || isProcessing()"
                                    class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Xử lý... } 
                                @else { <i class="fa-solid fa-boxes-packing"></i> Xác nhận & Trừ kho }
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
  styles: [`
    .card-input { @apply bg-white rounded-2xl border shadow-sm overflow-hidden; }
    .card-header { @apply px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2; }
    .label { @apply text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-wide; }
    .input-wrapper { @apply flex items-center border border-slate-200 rounded-xl bg-slate-50 focus-within:bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition overflow-hidden; }
    .input-field { @apply w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition placeholder-slate-300; }
    .unit-badge { @apply pr-3 text-xs font-bold text-slate-400 select-none bg-transparent; }
    .select-unit { @apply bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-blue-400 cursor-pointer px-2; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class SmartPrepComponent {
  invService = inject(InventoryService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  auth = inject(AuthService);
  formatNum = formatNum;

  // --- CONFIG DATA ---
  concUnits = CONC_UNITS;
  volUnits = VOL_UNITS;
  massUnits = MASS_UNITS;
  modes: {id: CalcMode, label: string, icon: string, color: string}[] = [
      { id: 'molar', label: 'Molar (Rắn)', icon: 'fa-weight-hanging', color: 'blue' },
      { id: 'dilution', label: 'Pha Loãng', icon: 'fa-droplet', color: 'orange' },
      { id: 'spiking', label: 'Thêm Chuẩn', icon: 'fa-syringe', color: 'emerald' },
      { id: 'serial', label: 'Dãy Chuẩn', icon: 'fa-arrow-down-wide-short', color: 'fuchsia' },
      { id: 'mix', label: 'Pha Mix', icon: 'fa-blender', color: 'indigo' }
  ];

  // --- STATE ---
  systemMode = signal<SystemMode>('sandbox');
  calcMode = signal<CalcMode>('molar');
  
  // Inputs
  mw = signal<number>(0);
  purity = signal<number>(100);
  stockConc = signal<number>(0);
  concUnit = signal<string>('M'); 
  targetConc = signal<number>(0);
  targetConcUnit = signal<string>('M');
  targetVol = signal<number>(0);
  targetVolUnit = signal<string>('ml');

  // Serial List
  serialPoints = signal<number[]>([0,0,0,0,0]); // Default 5 points

  // Mix List
  mixItems = signal<MixRow[]>([{ id: '1', name: '', stockConc: 0, targetConc: 0, unit: 'M', invItem: null }]);
  activeMixSearchIndex = signal<number | null>(null);

  // Real Mode State
  searchTerm = signal('');
  isSearching = signal(false);
  searchResults = signal<InventoryItem[]>([]);
  selectedItem = signal<InventoryItem | null>(null);
  isProcessing = signal(false);

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

      effect(() => { if (this.systemMode() === 'sandbox') this.clearSelection(); }, { allowSignalWrites: true });
  }

  setSystemMode(mode: SystemMode) { 
      if (mode === 'real' && !this.auth.canEditInventory()) {
          this.toast.show('Bạn cần quyền "Sửa Kho" để sử dụng chế độ Thực.', 'error');
          return;
      }
      this.systemMode.set(mode); 
  }
  setCalcMode(mode: CalcMode) { this.calcMode.set(mode); }

  // --- ACTIONS ---
  onSearch(term: string) { this.searchTerm.set(term); this.searchSubject.next({term}); }
  selectGlobalItem(item: InventoryItem) { this.selectedItem.set(item); this.searchResults.set([]); this.searchTerm.set(''); }
  clearSelection() { this.selectedItem.set(null); this.searchResults.set([]); this.searchTerm.set(''); }

  // Mix
  onSearchMix(index: number, event: any) { this.activeMixSearchIndex.set(index); this.searchSubject.next({ term: event.target.value, index }); }
  selectMixItem(index: number, item: InventoryItem) {
      this.mixItems.update(items => { const n = [...items]; n[index] = { ...n[index], name: item.name, invItem: item }; return n; });
      this.activeMixSearchIndex.set(null); this.searchResults.set([]);
  }
  addMixRow() { this.mixItems.update(i => [...i, { id: Date.now().toString(), name: '', stockConc: 0, targetConc: 0, unit: 'M', invItem: null }]); }
  removeMixRow(i: number) { this.mixItems.update(items => items.filter((_, idx) => idx !== i)); }
  clearMixItem(i: number) { this.mixItems.update(items => { const n = [...items]; n[i] = { ...n[i], name: '', invItem: null }; return n; }); }

  // Serial
  addSerialPoint() { this.serialPoints.update(p => [...p, 0]); }
  removeSerialPoint(i: number) { this.serialPoints.update(p => p.filter((_, idx) => idx !== i)); }

  // --- HELPER FOR IMMUTABLE UPDATES ---
  updateSerialPoint(index: number, value: number) {
    this.serialPoints.update(points => {
        const newArr = [...points];
        newArr[index] = value;
        return newArr;
    });
  }

  updateMixItem(index: number, field: keyof MixRow, value: any) {
    this.mixItems.update(rows => {
        const newArr = [...rows];
        newArr[index] = { ...newArr[index], [field]: value };
        return newArr;
    });
  }

  // --- UNIT CONVERSION LOGIC ---
  private getFactor(unit: string, type: 'conc' | 'vol' | 'mass'): number {
      let list: any[] = [];
      if (type === 'conc') list = CONC_UNITS;
      else if (type === 'vol') list = VOL_UNITS;
      else list = MASS_UNITS;
      const found = list.find(u => u.val === unit);
      return found ? found.factor : 1;
  }

  // --- CALCULATIONS ---
  resultValue = computed(() => {
      const mode = this.calcMode();
      
      // Get Base Values (Normalized to M, L, g)
      const cStockBase = this.stockConc() * this.getFactor(this.concUnit(), 'conc');
      const cTargetBase = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc'); // Use target unit for Molar/Dilution target
      const vTargetBase = this.targetVol() * this.getFactor(this.targetVolUnit(), 'vol');

      if (mode === 'molar') {
          const MW = this.mw();
          const P = this.purity() || 100;
          if (!MW) return 0;
          // Mass (g) = M (mol/L) * V (L) * MW (g/mol) * (100/P)
          // Note: cTargetBase is already normalized to Molar if using M/mM. 
          // If using %, logic differs (usually m/v). Assuming Molar logic here.
          const massG = cTargetBase * vTargetBase * MW * (100 / P);
          return massG; // Always return base unit (g) for now, can display better later
      }
      
      if (mode === 'dilution') {
          // V1 (L) = C2 * V2 / C1
          if (cStockBase === 0) return 0;
          // Target Conc for dilution uses the generic 'concUnit' for stock, but 'targetConc' input
          // In the UI for dilution, I used `concUnit` for both for simplicity in old code, 
          // but new UI has separate. Let's assume user converts or selects. 
          // Actually UI shows: Stock has unit, Target has SAME unit display.
          // Let's use `concUnit` for both C1 and C2 in Dilution to keep math simple V1 = C2*V2/C1
          // If units differ, we need separate selectors. The UI above uses `concUnit` for Target display.
          // Let's assume C1 and C2 share `concUnit`.
          const c1 = this.stockConc(); const c2 = this.targetConc();
          if (c1 === 0) return 0;
          const v1 = (c2 * this.targetVol()) / c1; // Result in Target Vol Unit
          return v1; 
      }

      if (mode === 'spiking') {
          // V_spike = V_sample * (C_add / C_stock)
          // Assumes C_add and C_stock same unit
          const cStock = this.stockConc(); const cAdd = this.targetConc();
          if (cStock === 0) return 0;
          return this.targetVol() * (cAdd / cStock);
      }

      return 0;
  });

  resultUnit = computed(() => {
      const mode = this.calcMode();
      if (mode === 'molar') return 'g';
      if (mode === 'dilution' || mode === 'spiking') return this.targetVolUnit(); 
      return '';
  });

  serialResult = computed<SerialPoint[]>(() => {
      if (this.calcMode() !== 'serial') return [];
      const C1 = this.stockConc();
      const V2 = this.targetVol(); // Vol per point
      if (C1 <= 0 || V2 <= 0) return [];

      return this.serialPoints().map(C2 => {
          if (!C2) return { conc: 0, unit: this.concUnit(), vStock: 0, vSolvent: 0 };
          // V1 = C2 * V2 / C1
          // Result V1 is in same unit as V2
          const v1 = (C2 * V2) / C1;
          
          // Convert to uL for better readability if small
          let v1_display = v1; 
          let vSolvent = V2 - v1;
          
          // Heuristic: If user selected 'mL', stock might be uL
          if (this.targetVolUnit() === 'ml') v1_display = v1 * 1000; 
          
          return { conc: C2, unit: this.concUnit(), vStock: v1_display, vSolvent: vSolvent };
      });
  });

  serialTotalStock = computed(() => this.serialResult().reduce((sum, p) => sum + p.vStock, 0));

  mixResult = computed(() => {
      if (this.calcMode() !== 'mix') return { details: [], solventVol: 0 };
      const V_total = this.targetVol();
      if (V_total <= 0) return { details: [], solventVol: 0 };

      let totalStockVol = 0;
      const details = this.mixItems().map(item => {
          if (item.stockConc <= 0) return { name: item.name || 'Unknown', vStock: 0 };
          
          // C1 * V1 = C2 * V2 => V1 = C2 * V2 / C1
          // Need unit normalization if units differ. 
          // For now assume same units for C1 and C2 in mix row.
          const v = (item.targetConc * V_total) / item.stockConc;
          totalStockVol += v;
          return { name: item.name || 'Unknown', vStock: v };
      });

      return { details, solventVol: Math.max(0, V_total - totalStockVol) };
  });

  resultDescription = computed(() => {
      const val = this.resultValue();
      const unit = this.resultUnit();
      const mode = this.calcMode();
      
      if (mode === 'molar') return `Cân chính xác ${this.formatNum(val)} ${unit} chất rắn. Hòa tan và định mức tới ${this.targetVol()} ${this.targetVolUnit()}.`;
      if (mode === 'dilution') {
          const vTotal = this.targetVol();
          const solvent = vTotal - val;
          return `Hút ${this.formatNum(val)} ${unit} dung dịch gốc. Thêm ${this.formatNum(solvent)} ${unit} dung môi để đạt ${vTotal} ${unit}.`;
      }
      return '';
  });

  // --- VALIDATION & CONFIRMATION ---
  
  stockPercentage = computed(() => {
      const item = this.selectedItem();
      if (!item) return 0;
      let req = this.resultValue();
      // Normalize units comparison needed here in real app
      // Assuming simple match for now
      if (item.stock <= 0) return 0;
      return Math.min((req / item.stock) * 100, 100);
  });

  mixStockStatus = computed(() => {
      if (this.calcMode() !== 'mix') return [];
      const res = this.mixResult();
      return this.mixItems().map((item, idx) => {
          const required = res.details[idx]?.vStock || 0;
          const hasStock = item.invItem ? (item.invItem.stock >= required) : true;
          return { name: item.name || `Chất ${idx+1}`, ok: hasStock };
      });
  });

  canFulfill = computed(() => {
      if (this.systemMode() === 'sandbox') return true;
      if (this.calcMode() === 'mix') return this.mixStockStatus().every(s => s.ok);
      const item = this.selectedItem();
      return item ? item.stock >= this.resultValue() : false;
  });

  async confirmTransaction() {
      if (!this.auth.canEditInventory()) {
           this.toast.show('Truy cập bị từ chối.', 'error');
           return;
      }
      if (!this.canFulfill()) {
          this.toast.show('Kho không đủ hàng!', 'error');
          return;
      }

      if (await this.confirmation.confirm({ message: 'Xác nhận trừ kho theo tính toán?', confirmText: 'Xác nhận & Trừ kho' })) {
          this.isProcessing.set(true);
          try {
              if (this.calcMode() === 'mix') {
                  const details = this.mixResult().details;
                  for(let i=0; i<this.mixItems().length; i++) {
                      const mItem = this.mixItems()[i];
                      const amount = details[i].vStock;
                      if (mItem.invItem && amount > 0) {
                          await this.invService.updateStock(mItem.invItem.id, mItem.invItem.stock, -amount, 'Pha Mix (Smart Prep)');
                      }
                  }
              } else {
                  const item = this.selectedItem()!;
                  let amount = this.resultValue();
                  // Normalize unit if result is 'g' but stock is 'mg', etc. 
                  // Simple logic: if result unit != stock unit, try simple conversion
                  if (this.resultUnit() === 'g' && item.unit === 'mg') amount *= 1000;
                  if (this.resultUnit() === 'l' && item.unit === 'ml') amount *= 1000;
                  
                  await this.invService.updateStock(item.id, item.stock, -amount, `Smart Prep: ${this.calcMode()}`);
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
