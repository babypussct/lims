
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../inventory/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { InventoryItem } from '../../core/models/inventory.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { formatNum } from '../../shared/utils/utils';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

type CalcMode = 'molar' | 'dilution' | 'spiking' | 'serial' | 'mix' | 'sample_prep';
type SystemMode = 'sandbox' | 'real';

// Unit Constants
const CONC_UNITS = [
    { val: 'M', factor: 1, label: 'M (Molar)' },
    { val: 'mM', factor: 0.001, label: 'mM' },
    { val: 'uM', factor: 0.000001, label: 'µM' },
    { val: '%', factor: 10, label: '%' },
    { val: 'mg/ml', factor: 1, label: 'mg/mL' },
    { val: 'ppm', factor: 0.001, label: 'ppm (mg/L)' },
    { val: 'ppb', factor: 0.000001, label: 'ppb (µg/L)' }
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
    <div class="h-full flex flex-col fade-in pb-10 font-sans text-slate-800 dark:text-slate-200">
        
        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
            <div>
                <h2 class="text-2xl font-black flex items-center gap-3 text-slate-800 dark:text-slate-100">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg">
                        <i class="fa-solid fa-flask-vial"></i>
                    </div>
                    Trạm Pha Chế
                </h2>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 ml-1">Công cụ tính toán & Tương tác kho hóa chất</p>
            </div>

            <div class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button (click)="setSystemMode('sandbox')" 
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2"
                        [class]="systemMode() === 'sandbox' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'">
                    <i class="fa-solid fa-calculator"></i> Nháp (Sandbox)
                </button>
                <button (click)="setSystemMode('real')" 
                        class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2"
                        [class]="systemMode() === 'real' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                        [class.opacity-60]="!auth.canEditInventory() && systemMode() !== 'real'"
                        [title]="auth.canEditInventory() ? 'Chế độ Thực (Trừ kho)' : 'Yêu cầu quyền Sửa Kho'">
                    <i class="fa-solid fa-link"></i> Kho (Real)
                    @if(!auth.canEditInventory()) { <i class="fa-solid fa-lock text-[9px]"></i> }
                </button>
            </div>
        </div>

        <div class="flex-1 flex flex-col xl:flex-row gap-6 min-h-0 relative z-10">
            
            <!-- LEFT PANEL: CONFIG -->
            <div class="w-full xl:w-5/12 bg-white dark:bg-slate-800 rounded-3xl shadow-soft-xl dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden h-[600px] xl:h-auto">
                
                <!-- Mode Tabs -->
                <div class="flex border-b border-slate-100 dark:border-slate-700 overflow-x-auto no-scrollbar">
                    @for (m of modes; track m.id) {
                        <button (click)="setCalcMode(m.id)" 
                                class="flex-1 min-w-[80px] py-4 text-[10px] font-bold uppercase tracking-wider border-b-2 transition hover:bg-slate-50 dark:hover:bg-slate-700 whitespace-nowrap flex flex-col items-center gap-1"
                                [class]="calcMode() === m.id ? m.activeClass : 'border-transparent text-slate-400'">
                            <i class="fa-solid {{m.icon}} text-sm mb-0.5"></i> {{m.label}}
                        </button>
                    }
                </div>

                <div class="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    
                    <!-- CHEMICAL SELECTOR (Real Mode & Not Mix & Not Sample Prep) -->
                    @if (systemMode() === 'real' && calcMode() !== 'mix' && calcMode() !== 'sample_prep') {
                        <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/30 space-y-2 animate-slide-up relative">
                            <label class="text-[10px] font-bold text-purple-800 dark:text-purple-300 uppercase flex items-center gap-2">
                                <i class="fa-solid fa-search"></i> Chọn Hóa chất (Trừ kho)
                            </label>
                            
                            @if (!selectedItem()) {
                                <div class="relative">
                                    <input [ngModel]="searchTerm()" (ngModelChange)="onSearch($event)" 
                                           placeholder="Nhập tên, mã số, hoặc công thức..." 
                                           class="w-full pl-9 pr-4 py-3 rounded-xl border-none ring-1 ring-purple-200 dark:ring-purple-700/50 focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-800 outline-none text-sm font-bold text-slate-700 dark:text-slate-200 placeholder-purple-300 dark:placeholder-purple-500/50 shadow-sm">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-purple-300 dark:text-purple-500/50"></i>
                                    
                                    @if (isSearching()) {
                                        <div class="absolute right-3 top-3 text-purple-500"><i class="fa-solid fa-circle-notch fa-spin"></i></div>
                                    }

                                    <!-- Dropdown -->
                                    @if (searchResults().length > 0) {
                                        <div class="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto z-50 custom-scrollbar">
                                            @for (item of searchResults(); track item.id) {
                                                <div (click)="selectGlobalItem(item)" class="p-3 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0 group transition">
                                                    <div class="font-bold text-sm text-slate-700 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400">{{item.name}}</div>
                                                    <div class="flex justify-between mt-1">
                                                        <span class="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{{item.id}}</span>
                                                        <span class="text-[10px] font-bold" [class]="item.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'">
                                                            Tồn: {{formatNum(item.stock)}} {{item.unit}}
                                                        </span>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>
                            } @else {
                                <div class="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm">
                                    <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg shrink-0">
                                        <i class="fa-solid fa-flask"></i>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{{selectedItem()?.name}}</div>
                                        <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <span class="bg-slate-100 dark:bg-slate-700 px-1.5 rounded font-mono">{{selectedItem()?.id}}</span>
                                            <span>Tồn: <b class="text-emerald-600 dark:text-emerald-400">{{formatNum(selectedItem()?.stock)}} {{selectedItem()?.unit}}</b></span>
                                        </div>
                                    </div>
                                    <button (click)="clearSelection()" class="w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 dark:text-red-400 dark:hover:text-red-400 transition flex items-center justify-center">
                                        <i class="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            }
                        </div>
                    }

                    <!-- 1. MOLAR (Pha rắn) -->
                    @if (calcMode() === 'molar') {
                        <div class="card-input border-blue-100 dark:border-blue-800/30">
                            <div class="card-header bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"><i class="fa-solid fa-weight-hanging"></i> Thông số Chất tan</div>
                            <div class="p-4 space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="label">Phân tử lượng (MW)</label>
                                        <div class="input-wrapper">
                                            <input type="number" min="0" step="any" [(ngModel)]="mw" class="input-field text-center" placeholder="e.g. 58.44">
                                            <span class="unit-badge">g/mol</span>
                                        </div>
                                    </div>
                                    <div class="space-y-1">
                                        <label class="label">Độ tinh khiết</label>
                                        <div class="input-wrapper">
                                            <input type="number" min="0" step="any" [(ngModel)]="purity" class="input-field text-center text-blue-600 font-bold" placeholder="100">
                                            <span class="unit-badge">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card-input border-blue-100 dark:border-blue-800/30">
                            <div class="card-header bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"><i class="fa-solid fa-scale-balanced"></i> Cân thực tế & Định mức</div>
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Khối lượng cân thực tế (m)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="actualMass" class="input-field flex-1 font-bold text-blue-600" placeholder="m">
                                        <select [(ngModel)]="actualMassUnit" class="select-unit w-24">
                                            @for(u of massUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Thể tích định mức (V)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="V">
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
                        <div class="card-input border-orange-100 dark:border-orange-800/30">
                            <div class="card-header bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"><i class="fa-solid fa-flask"></i> Thông số Gốc & Đích</div>
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Gốc (Stock)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-orange-600" placeholder="C1">
                                        <select [(ngModel)]="concUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Đích (Target)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="targetConc" class="input-field flex-1" placeholder="C2">
                                        <select [(ngModel)]="targetConcUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Thể tích Đích (V2)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="V2">
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
                        <div class="card-input border-emerald-100 dark:border-emerald-800/30">
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Chuẩn (Stock)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-emerald-600 dark:text-emerald-400" placeholder="C_stock">
                                        <select [(ngModel)]="concUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Thêm (Added)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="targetConc" class="input-field flex-1" placeholder="C_add">
                                        <select [(ngModel)]="targetConcUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Khối lượng / Thể tích Mẫu (Sample)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="m/V">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            <optgroup label="Khối lượng">
                                                @for(u of massUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                            </optgroup>
                                            <optgroup label="Thể tích">
                                                @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- 4. SERIAL DILUTION (Updated UI) -->
                    @if (calcMode() === 'serial') {
                        <div class="card-input border-fuchsia-100 dark:border-fuchsia-800/30">
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Nồng độ Gốc (Stock)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="stockConc" class="input-field flex-1 font-bold text-fuchsia-600 dark:text-fuchsia-400" placeholder="C1">
                                        <select [(ngModel)]="concUnit" class="select-unit w-24">
                                            @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="label">Thể tích định mức mỗi điểm (V_point)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="targetVol" class="input-field flex-1" placeholder="V">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Dynamic List for Points -->
                                <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <div class="flex justify-between items-center mb-1">
                                        <label class="label mb-0">Các điểm chuẩn</label>
                                        <div class="flex items-center gap-2">
                                            <select [(ngModel)]="targetConcUnit" class="select-unit w-20 h-6 py-0 text-[10px]">
                                                @for(u of concUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                            </select>
                                            <button (click)="addSerialPoint()" class="text-[10px] font-bold bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 px-2 py-1 rounded hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/40 transition">+ Thêm điểm</button>
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        <!-- FIX: Iterate over signal value and use update helper -->
                                        @for (pt of serialPoints(); track $index) {
                                            <div class="flex gap-2 items-center animate-slide-up">
                                                <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400">{{$index + 1}}</div>
                                                <input type="number" min="0" step="any" 
                                                       [ngModel]="pt" 
                                                       (ngModelChange)="updateSerialPoint($index, $event)"
                                                       class="input-field py-1.5 text-sm" 
                                                       placeholder="Conc">
                                                <div class="text-xs font-bold text-slate-400 w-8">{{targetConcUnit()}}</div>
                                                <button (click)="removeSerialPoint($index)" class="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition"><i class="fa-solid fa-times"></i></button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- 5. MIXER (Table UI) -->
                    @if (calcMode() === 'mix') {
                        <div class="card-input border-indigo-100 dark:border-indigo-800/30">
                            <div class="p-4 space-y-4">
                                <div class="space-y-1">
                                    <label class="label">Tổng thể tích hỗn hợp (V_final)</label>
                                    <div class="flex gap-2">
                                        <input type="number" min="0" step="any" [(ngModel)]="targetVol" class="input-field flex-1 text-center font-black text-indigo-600 dark:text-indigo-400 text-lg" placeholder="100">
                                        <select [(ngModel)]="targetVolUnit" class="select-unit w-24">
                                            @for(u of volUnits; track u.val) { <option [value]="u.val">{{u.label}}</option> }
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Mix Table -->
                                <div class="pt-2">
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="label mb-0">Thành phần</label>
                                        <div class="flex gap-2">
                                            <button (click)="pasteFromExcel()" class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-2 py-1 rounded transition border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1"><i class="fa-solid fa-paste"></i> Paste Excel</button>
                                            <button (click)="addMixRow()" class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-2 py-1 rounded transition border border-indigo-200 dark:border-indigo-800/50">+ Thêm chất</button>
                                        </div>
                                    </div>
                                    
                                    <div class="space-y-2">
                                        @for (row of mixItems(); track row.id; let i = $index) {
                                            <div class="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 relative group transition hover:border-indigo-300 hover:shadow-sm">
                                                <button (click)="removeMixRow(i)" class="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-slate-300 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-white dark:hover:bg-slate-800 transition"><i class="fa-solid fa-times"></i></button>
                                                
                                                <!-- Row Header: Name Search -->
                                                <div class="mb-2 pr-6 relative">
                                                    @if(systemMode() === 'real' && !row.invItem) {
                                                        <input placeholder="Tìm chất trong kho..." 
                                                               (input)="onSearchMix(i, $event)"
                                                               class="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-0">
                                                        <!-- Dropdown -->
                                                        @if(activeMixSearchIndex() === i && searchResults().length > 0) {
                                                            <div class="absolute top-full left-0 w-full z-20 bg-white dark:bg-slate-800 shadow-xl rounded-lg max-h-40 overflow-y-auto mt-1 border border-slate-100 dark:border-slate-700">
                                                                @for(res of searchResults(); track res.id) {
                                                                    <div (click)="selectMixItem(i, res)" class="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 cursor-pointer text-xs border-b border-slate-50 dark:border-slate-700/50">
                                                                        <div class="font-bold truncate">{{res.name}}</div>
                                                                        <div class="text-[9px] text-slate-400">Tồn: {{res.stock}} {{res.unit}}</div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        }
                                                    } @else if (row.invItem) {
                                                        <div class="flex items-center gap-2">
                                                            <span class="text-xs font-bold text-indigo-700 dark:text-indigo-400 truncate flex-1">{{row.invItem.name}}</span>
                                                            <button (click)="clearMixItem(i)" class="text-[10px] text-slate-400 hover:text-red-500 dark:text-red-400"><i class="fa-solid fa-rotate-left"></i></button>
                                                        </div>
                                                    } @else {
                                                        <!-- FIX: Use safe update method for name -->
                                                        <input [ngModel]="row.name" 
                                                               (ngModelChange)="updateMixItem(i, 'name', $event)" 
                                                               class="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-0" 
                                                               placeholder="Tên chất {{i+1}}">
                                                    }
                                                </div>

                                                <!-- Row Inputs -->
                                                <div class="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label class="text-[8px] font-bold text-slate-400 uppercase">Stock Conc</label>
                                                        <!-- FIX: Safe update for stockConc -->
                                                        <input type="number" min="0" step="any" 
                                                               [ngModel]="row.stockConc" 
                                                               (ngModelChange)="updateMixItem(i, 'stockConc', $event)"
                                                               class="w-full border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center font-bold" 
                                                               placeholder="C_stock">
                                                    </div>
                                                    <div class="flex gap-1">
                                                        <div class="flex-1">
                                                            <label class="text-[8px] font-bold text-slate-400 uppercase">Target</label>
                                                            <!-- FIX: Safe update for targetConc -->
                                                            <input type="number" min="0" step="any" 
                                                                   [ngModel]="row.targetConc" 
                                                                   (ngModelChange)="updateMixItem(i, 'targetConc', $event)"
                                                                   class="w-full border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center font-bold" 
                                                                   placeholder="C_target">
                                                        </div>
                                                        <div class="w-16">
                                                            <label class="text-[8px] font-bold text-slate-400 uppercase">Unit</label>
                                                            <!-- FIX: Safe update for unit -->
                                                            <select [ngModel]="row.unit" 
                                                                    (ngModelChange)="updateMixItem(i, 'unit', $event)"
                                                                    class="w-full border border-slate-200 dark:border-slate-700 rounded px-1 py-1 text-[10px] font-bold bg-white dark:bg-slate-800 h-[26px]">
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

                    <!-- 6. SAMPLE PREP (Dilution Factor) -->
                    @if (calcMode() === 'sample_prep') {
                        <div class="space-y-3">
                            <!-- Step 1 -->
                            <div class="card-input border-teal-100 dark:border-teal-800/30 animate-slide-up">
                                <div class="px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase flex justify-between items-center">
                                    <span><i class="fa-solid fa-scale-balanced"></i> Bước 1: Mẫu & Chiết</span>
                                    <span class="text-[9px] bg-white dark:bg-slate-800 px-2 rounded-full border border-teal-100 dark:border-teal-800/30">Start</span>
                                </div>
                                <div class="p-3 grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Khối lượng mẫu (m)</label>
                                        <div class="relative">
                                            <input type="number" min="0" step="any" [(ngModel)]="sampleMass" class="input-field pr-6" placeholder="10">
                                            <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">g</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Dung môi chiết (V1)</label>
                                        <div class="relative">
                                            <input type="number" min="0" step="any" [(ngModel)]="extractVol" class="input-field pr-8 text-teal-600 font-bold" placeholder="10">
                                            <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">mL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Flow Arrow -->
                            <div class="flex justify-center -my-1 text-slate-300 dark:text-slate-400 relative z-0"><i class="fa-solid fa-arrow-down"></i></div>

                            <!-- Step 2 -->
                            <div class="card-input border-cyan-100 dark:border-cyan-800/30 animate-slide-up">
                                <div class="px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase">
                                    <i class="fa-solid fa-filter"></i> Bước 2: Làm sạch (Cleanup)
                                </div>
                                <div class="p-3">
                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Hút dịch làm sạch (V2)</label>
                                    <div class="flex items-center gap-2">
                                        <div class="relative flex-1">
                                            <input type="number" min="0" step="any" [(ngModel)]="cleanupAliquot" class="input-field pr-8" placeholder="6">
                                            <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">mL</span>
                                        </div>
                                        @if(cleanupAliquot() > extractVol()) {
                                            <span class="text-red-500 dark:text-red-400 text-[10px] font-bold animate-pulse"><i class="fa-solid fa-triangle-exclamation"></i> > V1</span>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-center -my-1 text-slate-300 dark:text-slate-400 relative z-0"><i class="fa-solid fa-arrow-down"></i></div>

                            <!-- Step 3 -->
                            <div class="card-input border-sky-100 dark:border-sky-800/30 animate-slide-up">
                                <div class="px-4 py-2 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase">
                                    <i class="fa-solid fa-vial"></i> Bước 3: Phân đoạn (Aliquot)
                                </div>
                                <div class="p-3">
                                    <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Hút đi cô đặc (V3)</label>
                                    <div class="flex items-center gap-2">
                                        <div class="relative flex-1">
                                            <input type="number" min="0" step="any" [(ngModel)]="concAliquot" class="input-field pr-8 text-sky-600 font-bold" placeholder="5">
                                            <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">mL</span>
                                        </div>
                                        @if(concAliquot() > cleanupAliquot()) {
                                            <span class="text-red-500 dark:text-red-400 text-[10px] font-bold animate-pulse"><i class="fa-solid fa-triangle-exclamation"></i> > V2</span>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-center -my-1 text-slate-300 dark:text-slate-400 relative z-0"><i class="fa-solid fa-arrow-down"></i></div>

                            <!-- Step 4 -->
                            <div class="card-input border-indigo-100 dark:border-indigo-800/30 animate-slide-up">
                                <div class="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase flex justify-between items-center">
                                    <span><i class="fa-solid fa-flask"></i> Bước 4: Định mức cuối</span>
                                    <span class="text-[9px] bg-white dark:bg-slate-800 px-2 rounded-full border border-indigo-100 dark:border-indigo-800/30">End</span>
                                </div>
                                <div class="p-3 grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Thể tích cuối (V4)</label>
                                        <div class="relative">
                                            <input type="number" min="0" step="any" [(ngModel)]="finalVol" class="input-field pr-8 text-indigo-600 dark:text-indigo-400 font-black text-lg" placeholder="1">
                                            <span class="absolute right-3 top-3 text-xs font-bold text-slate-400">mL</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Hiệu suất (Recovery)</label>
                                        <div class="relative">
                                            <input type="number" min="0" step="any" [(ngModel)]="recovery" class="input-field pr-8" placeholder="100">
                                            <span class="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- RIGHT PANEL: RESULTS -->
            <div class="flex-1 flex flex-col gap-6 h-[600px] xl:h-auto">
                
                <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-soft-xl dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden relative flex-1 flex flex-col">
                    <!-- Color Bar -->
                    <div class="absolute top-0 left-0 w-full h-1.5 transition-colors duration-500" 
                         [class.bg-blue-500]="calcMode() === 'molar'"
                         [class.bg-orange-500]="calcMode() === 'dilution'"
                         [class.bg-emerald-500]="calcMode() === 'spiking'"
                         [class.bg-fuchsia-500]="calcMode() === 'serial'"
                         [class.bg-indigo-500]="calcMode() === 'mix'"
                         [class.bg-teal-500]="calcMode() === 'sample_prep'">
                    </div>

                    <div class="p-6 md:p-8 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                        <div class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">Kết quả tính toán</div>
                        
                        <!-- SAMPLE PREP RESULTS -->
                        @if (calcMode() === 'sample_prep') {
                            <div class="flex flex-col items-center justify-center h-full animate-scale-in">
                                
                                <!-- Dilution Factor Display -->
                                <div class="text-center mb-8">
                                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hệ số pha loãng (f)</div>
                                    <div class="relative inline-block">
                                        <h1 class="text-6xl md:text-8xl font-black tracking-tight text-teal-600 tabular-nums">
                                            {{ formatNum(samplePrepFactor()) }}
                                        </h1>
                                        @if(samplePrepFactor() < 1) {
                                            <span class="absolute -right-16 top-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 text-[10px] font-bold px-2 py-1 rounded border border-teal-200 dark:border-teal-800/50">Cô đặc {{formatNum(1/samplePrepFactor())}}x</span>
                                        } @else if(samplePrepFactor() > 1) {
                                            <span class="absolute -right-16 top-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded border border-orange-200 dark:border-orange-800/50">Loãng {{formatNum(samplePrepFactor())}}x</span>
                                        }
                                    </div>
                                    <p class="text-[10px] font-mono text-slate-400 mt-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full inline-block border border-slate-200 dark:border-slate-700">
                                        f = (V1 × V4) / (m × V3)
                                    </p>
                                </div>

                                <!-- Reverse Calculator -->
                                <div class="w-full max-w-sm bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div class="flex items-center gap-2 mb-4 justify-center">
                                        <i class="fa-solid fa-calculator text-teal-500"></i>
                                        <span class="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Tính Nồng độ Mẫu</span>
                                    </div>
                                    
                                    <div class="flex items-center gap-3">
                                        <div class="flex-1">
                                            <label class="text-[9px] font-bold text-slate-400 uppercase block mb-1">Kết quả chạy máy</label>
                                            <input type="number" min="0" step="any" [(ngModel)]="instConc" class="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-center font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-teal-500 transition" placeholder="C_inst">
                                        </div>
                                        <div class="text-slate-300 dark:text-slate-400 text-lg pt-4"><i class="fa-solid fa-arrow-right"></i></div>
                                        <div class="flex-1">
                                            <label class="text-[9px] font-bold text-slate-400 uppercase block mb-1">Kết quả thực</label>
                                            <div class="w-full bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800/50 rounded-xl px-3 py-2 text-center font-black text-teal-700 dark:text-teal-400 text-lg shadow-sm">
                                                {{ formatNum(sampleResult()) }}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    @if(recovery() !== 100) {
                                        <div class="mt-3 text-center">
                                            <span class="text-[9px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded border border-orange-100 dark:border-orange-800/30">
                                                Đã bù hiệu suất {{recovery()}}%
                                            </span>
                                        </div>
                                    }
                                </div>

                            </div>
                        }

                        <!-- SINGLE VALUE MODES -->
                        @if (['dilution', 'spiking'].includes(calcMode())) {
                            <div class="text-center space-y-4 animate-scale-in">
                                <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Thể tích cần hút (Stock)</div>
                                <div class="relative inline-block">
                                    <h1 class="text-6xl md:text-7xl font-black tracking-tight text-slate-800 dark:text-slate-100 tabular-nums">
                                        {{ formatNum(resultValue()) }}
                                    </h1>
                                    <span class="absolute -right-10 top-0 text-lg font-bold text-slate-400">{{ resultUnit() }}</span>
                                </div>
                                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    {{ resultDescription() }}
                                </p>
                            </div>
                        }

                        <!-- MOLAR RESULTS -->
                        @if (calcMode() === 'molar') {
                            <div class="text-center space-y-4 animate-scale-in">
                                <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nồng độ đạt được</div>
                                <div class="relative inline-block">
                                    <h1 class="text-6xl md:text-7xl font-black tracking-tight text-blue-600 tabular-nums">
                                        {{ formatNum(molarResult().val) }}
                                    </h1>
                                    <span class="absolute -right-12 top-0 text-lg font-bold text-slate-400">{{ molarResult().unit }}</span>
                                </div>
                                
                                <div class="flex justify-center gap-4 mt-6">
                                    @for(alt of molarResult().alternatives; track alt.unit) {
                                        <div class="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 min-w-[100px]">
                                            <div class="text-lg font-bold text-slate-700 dark:text-slate-200">{{formatNum(alt.val)}}</div>
                                            <div class="text-[10px] font-bold text-slate-400 uppercase">{{alt.unit}}</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                        <!-- SERIAL DILUTION TABLE -->
                        @if (calcMode() === 'serial') {
                            <div class="w-full animate-slide-up">
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900/20 uppercase font-bold">
                                        <tr>
                                            <th class="px-4 py-3 rounded-l-lg">Điểm chuẩn</th>
                                            <th class="px-4 py-3 text-right">Lượng Hút (Stock)</th>
                                            <th class="px-4 py-3 text-right rounded-r-lg">Thêm Dung môi</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for (pt of serialResult(); track $index) {
                                            <tr class="hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/40 transition">
                                                <td class="px-4 py-3 font-bold text-slate-700 dark:text-slate-200">{{pt.conc}} {{targetConcUnit()}}</td>
                                                <td class="px-4 py-3 text-right font-mono font-bold text-fuchsia-600 dark:text-fuchsia-400">{{formatNum(pt.vStock)}} {{pt.unit}}</td>
                                                <td class="px-4 py-3 text-right text-slate-500 dark:text-slate-400">{{formatNum(pt.vSolvent)}} {{targetVolUnit()}}</td>
                                            </tr>
                                        }
                                        <tr class="bg-slate-50 dark:bg-slate-900/50 font-bold border-t border-slate-200 dark:border-slate-700">
                                            <td class="px-4 py-3 text-slate-500 dark:text-slate-400">TỔNG STOCK CẦN</td>
                                            <td class="px-4 py-3 text-right text-fuchsia-700 dark:text-fuchsia-400 text-lg">{{formatNum(serialTotalStock())}} {{serialResult()[0]?.unit || 'µL'}}</td>
                                            <td class="px-4 py-3"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        }

                        <!-- MIX TABLE -->
                        @if (calcMode() === 'mix') {
                            <div class="w-full animate-slide-up">
                                <div class="mb-6 text-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                                    <span class="text-xs text-indigo-400 uppercase font-bold">Dung môi thêm vào (QS):</span>
                                    <div class="text-3xl font-black text-indigo-700 dark:text-indigo-400">{{formatNum(mixResult().solventVol)}} <span class="text-sm font-normal">{{targetVolUnit()}}</span></div>
                                </div>
                                <table class="w-full text-sm text-left">
                                    <thead class="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 uppercase font-bold">
                                        <tr>
                                            <th class="px-3 py-2 rounded-l-lg">Chất</th>
                                            <th class="px-3 py-2 text-right rounded-r-lg">Lượng Hút</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        @for (res of mixResult().details; track res.name) {
                                            <tr class="hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition">
                                                <td class="px-3 py-2 font-bold text-slate-700 dark:text-slate-200 truncate max-w-[150px]">{{res.name}}</td>
                                                <td class="px-3 py-2 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">{{formatNum(res.vStock)}} {{res.unit}}</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }

                        <!-- REAL MODE STOCK STATUS -->
                        @if (systemMode() === 'real' && (selectedItem() || calcMode() === 'serial' || calcMode() === 'mix')) {
                            <div class="w-full max-w-sm mx-auto mt-auto pt-6">
                                <div class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                                    
                                    @if (calcMode() === 'mix') {
                                        <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">Trạng thái kho (Hỗn hợp)</div>
                                        <div class="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                            @for (status of mixStockStatus(); track status.name) {
                                                <div class="flex justify-between items-center text-xs">
                                                    <span class="truncate max-w-[150px] font-medium text-slate-700 dark:text-slate-200">{{status.name}}</span>
                                                    @if(status.ok) {
                                                        <span class="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded flex items-center gap-1"><i class="fa-solid fa-check"></i> Đủ</span>
                                                    } @else {
                                                        <span class="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded flex items-center gap-1"><i class="fa-solid fa-xmark"></i> Thiếu</span>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    } @else {
                                        <div class="flex justify-between items-end mb-2">
                                            <div>
                                                <div class="text-[10px] font-bold text-slate-400 uppercase">Tồn kho hiện tại</div>
                                                <div class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ formatNum(selectedItem()?.stock || 0) }} {{ selectedItem()?.unit || ''}}</div>
                                            </div>
                                            @if(canFulfill()) {
                                                <span class="text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded"><i class="fa-solid fa-check-circle"></i> Đủ hàng</span>
                                            } @else {
                                                <span class="text-red-600 dark:text-red-400 text-xs font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"><i class="fa-solid fa-circle-exclamation"></i> Thiếu hàng</span>
                                            }
                                        </div>
                                        <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
                    <div class="p-5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex gap-3 shrink-0">
                        <button (click)="goToLabels()" class="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-95 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-print text-slate-400"></i> In Nhãn
                        </button>
                        
                        @if (systemMode() === 'real') {
                            <button (click)="confirmTransaction()" 
                                    [disabled]="!canFulfill() || isProcessing()"
                                    class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 dark:shadow-none transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Xử lý... } 
                                @else { <i class="fa-solid fa-boxes-packing"></i> Xác nhận & Trừ kho }
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>

        <!-- QUICK PRINT MODAL -->
        @if (showLabelModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <i class="fa-solid fa-print text-blue-500"></i> In Nhãn Nhanh
                        </h3>
                        <button (click)="closeLabelModal()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nội dung nhãn (Có thể sửa)</label>
                            <textarea [ngModel]="labelData()" (ngModelChange)="labelData.set($event)" class="w-full h-32 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none bg-slate-50 dark:bg-slate-900/50"></textarea>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-3">
                            <div>
                                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Khổ rộng (mm)</label>
                                <input type="number" [ngModel]="quickPrintWidth()" (ngModelChange)="quickPrintWidth.set($event)" class="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-blue-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Chiều dài (mm)</label>
                                <input type="number" [ngModel]="quickPrintHeight()" (ngModelChange)="quickPrintHeight.set($event)" class="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-blue-500">
                            </div>
                            <div>
                                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Cỡ chữ (pt)</label>
                                <input type="number" [ngModel]="quickPrintFontSize()" (ngModelChange)="quickPrintFontSize.set($event)" class="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm font-bold text-center outline-none focus:border-blue-500">
                            </div>
                        </div>

                        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-start gap-3">
                            <i class="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                            <div class="text-xs text-blue-800">
                                <p class="font-bold mb-1">Mẹo in nhanh:</p>
                                <p>Bạn có thể chỉnh sửa nội dung trước khi in. Để cài đặt khổ giấy hoặc in hàng loạt, vui lòng truy cập menu <a routerLink="/labels" class="font-bold underline cursor-pointer">In Tem & Nhãn</a>.</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex gap-3 justify-end">
                        <button (click)="closeLabelModal()" class="px-4 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">Hủy</button>
                        <button (click)="printQuickLabel()" class="px-6 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none transition flex items-center gap-2">
                            <i class="fa-solid fa-print"></i> In Ngay
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  `,
  styles: [`
    .card-input { @apply bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 shadow-sm overflow-hidden; }
    .card-header { @apply px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2; }
    .label { @apply text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1 tracking-wide; }
    .input-wrapper { @apply flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30 transition overflow-hidden; }
    .input-field { @apply w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition placeholder-slate-300 dark:placeholder-slate-600; }
    .unit-badge { @apply pr-3 text-xs font-bold text-slate-400 select-none bg-transparent; }
    .select-unit { @apply bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:border-blue-400 dark:focus:border-blue-500 cursor-pointer px-2; }
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
  router = inject(Router);
  formatNum = formatNum;

  // --- CONFIG DATA ---
  concUnits = CONC_UNITS;
  volUnits = VOL_UNITS;
  massUnits = MASS_UNITS;
  modes: {id: CalcMode, label: string, icon: string, color: string, activeClass: string}[] = [
      { id: 'molar', label: 'Molar (Rắn)', icon: 'fa-weight-hanging', color: 'blue', activeClass: 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/20 dark:bg-blue-900/20' },
      { id: 'dilution', label: 'Pha Loãng', icon: 'fa-droplet', color: 'orange', activeClass: 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/20 dark:bg-orange-900/20' },
      { id: 'spiking', label: 'Thêm Chuẩn', icon: 'fa-syringe', color: 'emerald', activeClass: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/20 dark:bg-emerald-900/20' },
      { id: 'serial', label: 'Dãy Chuẩn', icon: 'fa-arrow-down-wide-short', color: 'fuchsia', activeClass: 'border-fuchsia-500 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-50/20 dark:bg-fuchsia-900/20' },
      { id: 'mix', label: 'Pha Mix', icon: 'fa-blender', color: 'indigo', activeClass: 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-900/20' },
      { id: 'sample_prep', label: 'Xử lý Mẫu', icon: 'fa-vials', color: 'teal', activeClass: 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50/20 dark:bg-teal-900/20' }
  ];

  // --- STATE ---
  systemMode = signal<SystemMode>('sandbox');
  calcMode = signal<CalcMode>('molar');
  
  // Inputs
  mw = signal<number>(0);
  purity = signal<number>(100);
  actualMass = signal<number>(10);
  actualMassUnit = signal<string>('mg');
  stockConc = signal<number>(1000);
  concUnit = signal<string>('ppm'); 
  targetConc = signal<number>(10);
  targetConcUnit = signal<string>('ppm');
  targetVol = signal<number>(10);
  targetVolUnit = signal<string>('ml');

  // Sample Prep Inputs (New)
  sampleMass = signal<number>(10);
  extractVol = signal<number>(10);
  cleanupAliquot = signal<number>(6); // V2
  concAliquot = signal<number>(5);    // V3
  finalVol = signal<number>(1);       // V4
  recovery = signal<number>(100);     // %
  instConc = signal<number>(0);       // Input for reverse calc

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

  async pasteFromExcel() {
      try {
          const text = await navigator.clipboard.readText();
          if (!text) return;
          
          const rows = text.split('\n').filter(r => r.trim() !== '');
          const newItems: MixRow[] = [];
          
          rows.forEach((row, idx) => {
              const cols = row.split('\t');
              if (cols.length >= 2) {
                  newItems.push({
                      id: Date.now().toString() + idx,
                      name: cols[0].trim(),
                      stockConc: parseFloat(cols[1]) || 0,
                      targetConc: cols.length >= 3 ? (parseFloat(cols[2]) || 0) : 0,
                      unit: 'ppm', // Default
                      invItem: null
                  });
              }
          });

          if (newItems.length > 0) {
              this.mixItems.set(newItems);
              this.toast.show(`Đã import ${newItems.length} chất từ Clipboard`, 'success');
          } else {
              this.toast.show('Không tìm thấy dữ liệu hợp lệ. Copy 3 cột: Tên | C_stock | C_target', 'error');
          }
      } catch (err) {
          this.toast.show('Lỗi đọc Clipboard. Hãy cấp quyền cho trình duyệt.', 'error');
      }
  }

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

  // Helper to convert calculated amount to stock unit for accurate comparison/deduction
  private normalizeToStockUnit(amount: number, fromUnit: string, toUnit: string): number {
      if (!fromUnit || !toUnit || fromUnit === toUnit) return amount;
      
      const fromUnitLower = fromUnit.toLowerCase();
      const toUnitLower = toUnit.toLowerCase();

      // Mass conversion
      if (['g', 'mg', 'kg', 'ug'].includes(fromUnitLower) && ['g', 'mg', 'kg', 'ug'].includes(toUnitLower)) {
          const fromFactor = this.getFactor(fromUnitLower, 'mass');
          const toFactor = this.getFactor(toUnitLower, 'mass');
          return amount * (fromFactor / toFactor);
      }
      
      // Volume conversion
      if (['l', 'ml', 'ul'].includes(fromUnitLower) && ['l', 'ml', 'ul'].includes(toUnitLower)) {
          const fromFactor = this.getFactor(fromUnitLower, 'vol');
          const toFactor = this.getFactor(toUnitLower, 'vol');
          return amount * (fromFactor / toFactor);
      }

      // If units are incompatible (e.g. g to ml), return amount as is (assume user knows what they are doing or it's a 1:1 density assumption)
      return amount;
  }

  // --- CALCULATIONS ---
  molarResult = computed(() => {
      if (this.calcMode() !== 'molar') return { val: 0, unit: 'M', alternatives: [] };
      
      const m = this.actualMass();
      const mUnit = this.actualMassUnit();
      const v = this.targetVol();
      const vUnit = this.targetVolUnit();
      const MW = this.mw();
      const P = this.purity() || 100;

      if (m <= 0 || v <= 0) return { val: 0, unit: 'M', alternatives: [] };

      // Convert mass to grams
      const massG = m * this.getFactor(mUnit, 'mass') * (P / 100);
      // Convert vol to Liters
      const volL = v * this.getFactor(vUnit, 'vol');

      // Base conc: g/L (which is also mg/mL)
      const concGL = massG / volL;
      
      const alts = [
          { val: concGL * 1000, unit: 'ppm' },
          { val: concGL, unit: 'mg/mL' },
          { val: concGL / 10, unit: '%' }
      ];

      if (MW > 0) {
          const molar = concGL / MW; // mol/L = M
          return {
              val: molar, unit: 'M',
              alternatives: [
                  { val: molar * 1000, unit: 'mM' },
                  { val: molar * 1000000, unit: 'µM' },
                  ...alts
              ]
          };
      }

      return {
          val: concGL * 1000, unit: 'ppm',
          alternatives: alts.filter(a => a.unit !== 'ppm')
      };
  });

  resultValue = computed(() => {
      const mode = this.calcMode();
      
      if (mode === 'molar') return this.actualMass(); // Just return input for stock deduction
      
      if (mode === 'dilution') {
          const c1 = this.stockConc() * this.getFactor(this.concUnit(), 'conc'); 
          const c2 = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
          if (c1 === 0) return 0;
          
          // V1 = C2 * V2 / C1 (V1 will be in same unit as V2)
          let v1 = (c2 * this.targetVol()) / c1; 
          
          // Auto convert to uL if < 1mL and unit is mL
          if (v1 < 1 && this.targetVolUnit() === 'ml') {
              return v1 * 1000;
          }
          return v1; 
      }

      if (mode === 'spiking') {
          const cStock = this.stockConc() * this.getFactor(this.concUnit(), 'conc'); 
          const cAdd = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
          if (cStock === 0) return 0;
          
          // V_spike = V_sample * (C_add / C_stock)
          // Note: V_sample might be mass (g). We assume 1g ~ 1mL for simple spiking logic if density not provided.
          // Or we just treat the 'targetVol' input as the base unit for the calculation.
          let v1 = this.targetVol() * (cAdd / cStock);
          
          // Auto convert to uL if < 1mL
          const vUnit = this.targetVolUnit();
          if (v1 < 1 && (vUnit === 'ml' || vUnit === 'g')) {
              return v1 * 1000;
          }
          return v1;
      }

      return 0;
  });

  resultUnit = computed(() => {
      const mode = this.calcMode();
      if (mode === 'molar') return this.actualMassUnit();
      
      if (mode === 'dilution') {
          const c1 = this.stockConc() * this.getFactor(this.concUnit(), 'conc'); 
          const c2 = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
          if (c1 === 0) return this.targetVolUnit();
          let v1 = (c2 * this.targetVol()) / c1; 
          if (v1 < 1 && this.targetVolUnit() === 'ml') return 'ul';
          return this.targetVolUnit();
      }

      if (mode === 'spiking') {
          const cStock = this.stockConc() * this.getFactor(this.concUnit(), 'conc'); 
          const cAdd = this.targetConc() * this.getFactor(this.targetConcUnit(), 'conc');
          if (cStock === 0) return this.targetVolUnit();
          let v1 = this.targetVol() * (cAdd / cStock);
          const vUnit = this.targetVolUnit();
          if (v1 < 1 && (vUnit === 'ml' || vUnit === 'g')) return 'ul';
          return vUnit;
      }
      return '';
  });

  // --- SAMPLE PREP CALCULATIONS ---
  samplePrepFactor = computed(() => {
      const m = this.sampleMass();
      const V1 = this.extractVol();
      const V3 = this.concAliquot(); // Volume taken to concentrate
      const V4 = this.finalVol();
      
      if (m <= 0 || V3 <= 0) return 0;
      
      // Factor f = (V1 * V4) / (m * V3)
      // Logic verified: C_sample = C_inst * f
      return (V1 * V4) / (m * V3);
  });

  sampleResult = computed(() => {
      const inst = this.instConc();
      const f = this.samplePrepFactor();
      const R = this.recovery() || 100;
      
      // C_sample = C_inst * f * (100 / Recovery)
      if (R <= 0) return 0;
      return inst * f * (100 / R);
  });

  serialResult = computed<any[]>(() => {
      if (this.calcMode() !== 'serial') return [];
      const C1 = this.stockConc() * this.getFactor(this.concUnit(), 'conc');
      const V2 = this.targetVol(); // Vol per point
      if (C1 <= 0 || V2 <= 0) return [];

      return this.serialPoints().map(C2_input => {
          if (!C2_input) return { conc: 0, unit: 'ul', vStock: 0, vSolvent: 0 };
          
          const C2 = C2_input * this.getFactor(this.targetConcUnit(), 'conc');
          let v1 = (C2 * V2) / C1;
          
          let vUnit = this.targetVolUnit();
          if (v1 < 1 && this.targetVolUnit() === 'ml') {
              v1 = v1 * 1000;
              vUnit = 'ul';
          }
          
          // Calculate solvent in original target unit
          const v1_in_target_unit = (C2 * V2) / C1;
          let vSolvent = V2 - v1_in_target_unit;
          
          return { conc: C2_input, unit: vUnit, vStock: v1, vSolvent: vSolvent };
      });
  });

  serialTotalStock = computed(() => {
      // Return total in the unit of the first point for simplicity, or standardize to uL
      const res = this.serialResult();
      if (res.length === 0) return 0;
      return res.reduce((sum, p) => sum + p.vStock, 0);
  });

  mixResult = computed(() => {
      if (this.calcMode() !== 'mix') return { details: [], solventVol: 0 };
      const V_total = this.targetVol();
      if (V_total <= 0) return { details: [], solventVol: 0 };

      let totalStockVol = 0;
      const details = this.mixItems().map(item => {
          if (item.stockConc <= 0) return { name: item.name || 'Unknown', vStock: 0, unit: this.targetVolUnit() };
          
          const c1 = item.stockConc * this.getFactor('ppm', 'conc'); // Assume mix stock is ppm for now, or add unit selector
          const c2 = item.targetConc * this.getFactor(item.unit, 'conc');
          
          let v1 = (c2 * V_total) / c1;
          totalStockVol += v1; // Keep track in targetVolUnit
          
          let vUnit = this.targetVolUnit();
          if (v1 < 1 && this.targetVolUnit() === 'ml') {
              v1 = v1 * 1000;
              vUnit = 'ul';
          }
          
          return { name: item.name || 'Unknown', vStock: v1, unit: vUnit };
      });

      return { details, solventVol: Math.max(0, V_total - totalStockVol) };
  });

  resultDescription = computed(() => {
      const val = this.resultValue();
      const unit = this.resultUnit();
      const mode = this.calcMode();
      
      if (mode === 'dilution') {
          const vTotal = this.targetVol();
          // If val is in uL but vTotal is in mL, need to convert for display
          let vTotalDisplay = vTotal;
          let vTotalUnit = this.targetVolUnit();
          
          return `Hút ${this.formatNum(val)} ${unit} dung dịch gốc. Định mức tới ${vTotalDisplay} ${vTotalUnit} bằng dung môi.`;
      }
      if (mode === 'spiking') {
          return `Hút ${this.formatNum(val)} ${unit} dung dịch chuẩn thêm vào mẫu.`;
      }
      return '';
  });

  // --- VALIDATION & CONFIRMATION ---
  
  stockPercentage = computed(() => {
      const item = this.selectedItem();
      if (!item || item.stock <= 0) return 0;
      
      let req = 0;
      if (this.calcMode() === 'serial') {
          // Serial uses uL internally for display, need to convert to targetVolUnit first, then to stock unit
          const totalStock_uL = this.serialTotalStock();
          const totalStock_TargetUnit = this.targetVolUnit() === 'ml' ? totalStock_uL / 1000 : totalStock_uL;
          req = this.normalizeToStockUnit(totalStock_TargetUnit, this.targetVolUnit(), item.unit);
      } else {
          req = this.normalizeToStockUnit(this.resultValue(), this.resultUnit(), item.unit);
      }
      
      return Math.min((req / item.stock) * 100, 100);
  });

  mixStockStatus = computed(() => {
      if (this.calcMode() !== 'mix') return [];
      const res = this.mixResult();
      return this.mixItems().map((item, idx) => {
          const required = res.details[idx]?.vStock || 0;
          if (!item.invItem) return { name: item.name || `Chất ${idx+1}`, ok: true };
          
          const normalizedReq = this.normalizeToStockUnit(required, this.targetVolUnit(), item.invItem.unit);
          return { name: item.name || `Chất ${idx+1}`, ok: item.invItem.stock >= normalizedReq };
      });
  });

  canFulfill = computed(() => {
      if (this.systemMode() === 'sandbox') return true;
      if (this.calcMode() === 'mix') return this.mixStockStatus().every(s => s.ok);
      if (this.calcMode() === 'sample_prep') return true; // Sample prep doesn't deduct stock directly
      
      const item = this.selectedItem();
      if (!item) return false;

      let req = 0;
      if (this.calcMode() === 'serial') {
          const totalStock_uL = this.serialTotalStock();
          const totalStock_TargetUnit = this.targetVolUnit() === 'ml' ? totalStock_uL / 1000 : totalStock_uL;
          req = this.normalizeToStockUnit(totalStock_TargetUnit, this.targetVolUnit(), item.unit);
      } else {
          req = this.normalizeToStockUnit(this.resultValue(), this.resultUnit(), item.unit);
      }

      return item.stock >= req;
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
                          const normalizedAmount = this.normalizeToStockUnit(amount, this.targetVolUnit(), mItem.invItem.unit);
                          await this.invService.updateStock(mItem.invItem.id, mItem.invItem.stock, -normalizedAmount, 'Pha Mix (Smart Prep)');
                      }
                  }
              } else if (this.calcMode() === 'serial') {
                  const item = this.selectedItem()!;
                  const totalStock_uL = this.serialTotalStock();
                  const totalStock_TargetUnit = this.targetVolUnit() === 'ml' ? totalStock_uL / 1000 : totalStock_uL;
                  const normalizedAmount = this.normalizeToStockUnit(totalStock_TargetUnit, this.targetVolUnit(), item.unit);
                  await this.invService.updateStock(item.id, item.stock, -normalizedAmount, `Smart Prep: Dãy chuẩn`);
              } else if (this.calcMode() !== 'sample_prep') {
                  const item = this.selectedItem()!;
                  const normalizedAmount = this.normalizeToStockUnit(this.resultValue(), this.resultUnit(), item.unit);
                  await this.invService.updateStock(item.id, item.stock, -normalizedAmount, `Smart Prep: ${this.calcMode()}`);
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

  // --- LABEL PRINT MODAL STATE ---
  showLabelModal = signal(false);
  labelData = signal('');
  quickPrintWidth = signal(62);
  quickPrintHeight = signal(25);
  quickPrintFontSize = signal(12);

  openLabelModal() {
      const mode = this.calcMode();
      let labelText = '';
      const dateStr = new Date().toISOString().split('T')[0];
      const user = this.auth.currentUser()?.displayName || 'User';

      if (mode === 'molar') {
          const item = this.selectedItem();
          const name = item ? item.name : 'Hóa chất';
          const conc = `${this.formatNum(this.molarResult().val)} ${this.molarResult().unit}`;
          labelText = `${name}\n${conc}\n${dateStr} - ${user}`;
      } else if (mode === 'dilution') {
          const item = this.selectedItem();
          const name = item ? item.name : 'Dung dịch';
          const conc = `${this.formatNum(this.targetConc())} ${this.targetConcUnit()}`;
          labelText = `${name}\n${conc}\n${dateStr} - ${user}`;
      } else if (mode === 'spiking') {
          labelText = `Mẫu Spike\n+${this.formatNum(this.targetConc())} ${this.targetConcUnit()}\n${dateStr} - ${user}`;
      } else if (mode === 'serial') {
          const item = this.selectedItem();
          const name = item ? item.name : 'Chuẩn';
          const points = this.serialResult();
          labelText = points.map((p, i) => `STD ${i+1}: ${name}\n${p.conc} ${this.targetConcUnit()}\n${dateStr} - ${user}`).join('\n\n');
      } else if (mode === 'mix') {
          labelText = `Mix Chuẩn\n${this.mixItems().length} thành phần\n${dateStr} - ${user}`;
      } else if (mode === 'sample_prep') {
          labelText = `Mẫu xử lý\nf = ${this.formatNum(this.samplePrepFactor())}\n${dateStr} - ${user}`;
      }

      this.labelData.set(labelText);
      this.showLabelModal.set(true);
  }

  closeLabelModal() {
      this.showLabelModal.set(false);
  }

  printQuickLabel() {
      const labels = this.labelData().split('\n\n').filter(l => l.trim() !== '');
      if (labels.length === 0) return;

      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (!printWindow) {
          this.toast.show('Trình duyệt chặn Pop-up. Hãy cho phép để in.', 'error');
          return;
      }

      const w = this.quickPrintWidth();
      const h = this.quickPrintHeight();
      const fs = this.quickPrintFontSize();

      const css = `
        @page { size: ${w}mm ${h * labels.length}mm; margin: 0; }
        body { margin: 0; padding: 0; font-family: 'Roboto Mono', monospace; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        * { box-sizing: border-box; }
        .label-container {
            width: ${w}mm;
            height: ${h}mm;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px dashed #ccc;
            page-break-after: avoid;
            page-break-inside: avoid;
            overflow: hidden;
            position: relative;
        }
        .label-text {
            font-size: ${fs}pt;
            font-weight: bold;
            text-align: center;
            line-height: 1.2;
            word-break: break-all;
            padding: 1mm;
            width: 100%;
            white-space: pre-wrap;
        }
        @media print {
            @page { margin: 0; }
            .label-container { border-bottom: none; }
            body { margin: 0; }
        }
      `;

      let htmlContent = `<!DOCTYPE html><html><head><title>Quick Print</title><style>${css}</style></head><body onload="window.focus(); window.print();">`;
      
      labels.forEach(label => {
          htmlContent += `<div class="label-container"><div class="label-text">${label}</div></div>`;
      });

      htmlContent += `</body></html>`;

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
  }

  goToLabels() {
      this.openLabelModal();
  }
}
