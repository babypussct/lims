import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sop, SopTarget } from '../../../core/models/sop.model';

interface ProposedBatch {
    id: string; 
    name: string; 
    sop: Sop;
    targets: SopTarget[]; 
    samples: Set<string>; 
    tasks?: any[]; 
}

export interface SplitWizardState {
    step: 1 | 2 | 3;
    sourceBatchName: string;
    availableSamples: string[];
    selectedSamples: Set<string>;
    availableTargets: SopTarget[];
    selectedTargets: Set<string>;
    selectedSopId: string | null;
}

@Component({
  selector: 'app-batch-split-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] animate-slide-up">
            
            <!-- Header -->
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                <div>
                    <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-shuffle text-blue-600 dark:text-blue-400"></i> Phân tách & Chuyển Mẻ
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Nguồn: <b>{{state().sourceBatchName}}</b></p>
                </div>
                <button (click)="close.emit()" class="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition"><i class="fa-solid fa-times text-xl"></i></button>
            </div>

            <!-- Steps Indicator -->
            <div class="flex border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="state().step >= 1 ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-300 dark:text-slate-600'">1. Chọn Mẫu</div>
                <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="state().step >= 2 ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-300 dark:text-slate-600'">2. Chọn Chỉ tiêu</div>
                <div class="flex-1 py-3 text-center text-xs font-bold border-b-2 transition-colors" [class]="state().step >= 3 ? 'border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-300 dark:text-slate-600'">3. Chọn Quy trình</div>
            </div>

            <!-- Wizard Content -->
            <div class="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-900/50 relative p-4 md:p-6">
                
                <!-- STEP 1: SELECT SAMPLES -->
                @if (state().step === 1) {
                    <div class="h-full flex flex-col gap-3 animate-fade-in">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Chọn mẫu cần chuyển đi</h4>
                            <div class="text-xs space-x-2">
                                <button (click)="selectAllSamples()" class="text-blue-600 dark:text-blue-400 hover:underline font-bold">Chọn hết</button>
                                <button (click)="deselectAllSamples()" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">Bỏ chọn</button>
                            </div>
                        </div>
                        <div class="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                @for(sample of state().availableSamples; track sample) {
                                    <div (click)="toggleSample(sample)" 
                                         class="p-3 md:p-2 rounded-lg border cursor-pointer text-center transition select-none"
                                         [class]="state().selectedSamples.has(sample) ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'">
                                        <span class="text-sm md:text-xs font-mono font-bold">{{sample}}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }

                <!-- STEP 2: SELECT TARGETS -->
                @if (state().step === 2) {
                    <div class="h-full flex flex-col gap-3 animate-fade-in">
                        <div class="flex justify-between items-center mb-2">
                            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Chọn chỉ tiêu cần thực hiện</h4>
                            <div class="text-xs space-x-2">
                                <button (click)="selectAllTargets()" class="text-blue-600 dark:text-blue-400 hover:underline font-bold">Chọn hết</button>
                                <button (click)="deselectAllTargets()" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">Bỏ chọn</button>
                            </div>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-300 mb-2">
                            <i class="fa-solid fa-circle-info mr-1"></i>
                            Các mẫu đã chọn ({{state().selectedSamples.size}}) sẽ được chuyển sang mẻ mới để làm các chỉ tiêu này.
                        </div>
                        <div class="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2">
                            @for(t of state().availableTargets; track t.id) {
                                <label class="flex items-center gap-3 p-4 md:p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-50 dark:border-slate-700/50 last:border-0 cursor-pointer active:bg-slate-100">
                                    <input type="checkbox" 
                                           [checked]="state().selectedTargets.has(t.id)" 
                                           (change)="toggleTarget(t.id)"
                                           class="w-5 h-5 md:w-4 md:h-4 accent-blue-600 rounded">
                                    <span class="text-base md:text-sm font-bold text-slate-700 dark:text-slate-300">{{t.name}}</span>
                                </label>
                            }
                        </div>
                    </div>
                }

                <!-- STEP 3: SELECT SOP -->
                @if (state().step === 3) {
                    <div class="h-full flex flex-col gap-3 animate-fade-in">
                        <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Đề xuất Quy trình (SOP) phù hợp</h4>
                        <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            @for(sop of filteredSops(); track sop.id) {
                                <div (click)="selectSop(sop.id)" 
                                     class="p-4 rounded-xl border cursor-pointer transition flex justify-between items-center group relative overflow-hidden"
                                     [class]="state().selectedSopId === sop.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500 shadow-md' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'">
                                    
                                    @if(state().selectedSopId === sop.id) {
                                        <div class="absolute top-0 right-0 w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-bl-xl"><i class="fa-solid fa-check text-sm"></i></div>
                                    }

                                    <div class="pr-6">
                                        <div class="font-bold text-slate-800 dark:text-slate-200 text-base group-hover:text-blue-700 dark:group-hover:text-blue-400 leading-tight">{{sop.name}}</div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{sop.category}}</div>
                                    </div>
                                    <div class="text-right shrink-0">
                                        <div class="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">Độ phủ</div>
                                        <div class="text-lg font-black text-emerald-600 dark:text-emerald-400">100%</div>
                                    </div>
                                </div>
                            }
                            @if(filteredSops().length === 0) {
                                <div class="p-8 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <i class="fa-solid fa-filter-circle-xmark text-3xl mb-3"></i>
                                    <p class="text-sm font-medium">Không tìm thấy SOP nào phủ hết các chỉ tiêu đã chọn.</p>
                                    <button (click)="prevStep()" class="text-blue-600 dark:text-blue-400 font-bold hover:underline mt-4 text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">Quay lại chọn ít chỉ tiêu hơn</button>
                                </div>
                            }
                        </div>
                    </div>
                }

            </div>

            <!-- Footer Buttons -->
            <div class="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                @if (state().step > 1) {
                    <button (click)="prevStep()" class="px-5 py-3 md:py-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 md:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">
                        <i class="fa-solid fa-arrow-left mr-1"></i> Quay lại
                    </button>
                } @else {
                    <div></div>
                }

                @if (state().step < 3) {
                    <button (click)="nextStep()" 
                            [disabled]="(state().step === 1 && state().selectedSamples.size === 0) || (state().step === 2 && state().selectedTargets.size === 0)"
                            class="px-8 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                        Tiếp tục <i class="fa-solid fa-arrow-right ml-1"></i>
                    </button>
                } @else {
                    <button (click)="confirm()" 
                            [disabled]="!state().selectedSopId"
                            class="px-8 py-3 md:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-check mr-1"></i> Hoàn tất
                    </button>
                }
            </div>
        </div>
    </div>
  `
})
export class BatchSplitWizardComponent {
    @Input({required: true}) sourceBatch!: ProposedBatch;
    @Input({required: true}) allSops!: Sop[];
    
    @Output() close = new EventEmitter<void>();
    @Output() execute = new EventEmitter<{
        samples: Set<string>;
        targets: Set<string>;
        sopId: string;
    }>();

    state = signal<SplitWizardState>({
        step: 1,
        sourceBatchName: '',
        availableSamples: [],
        selectedSamples: new Set(),
        availableTargets: [],
        selectedTargets: new Set(),
        selectedSopId: null
    });

    ngOnInit() {
        this.state.set({
            step: 1,
            sourceBatchName: this.sourceBatch.name,
            availableSamples: Array.from(this.sourceBatch.samples).sort(),
            selectedSamples: new Set<string>(),
            availableTargets: this.sourceBatch.targets,
            selectedTargets: new Set<string>(this.sourceBatch.targets.map(t => t.id)),
            selectedSopId: null
        });
    }

    filteredSops = computed(() => {
        const s = this.state();
        if (s.step !== 3) return [];
        const reqTargets = s.selectedTargets;
        if (reqTargets.size === 0) return [];
        return this.allSops.filter(sop => {
            if (!sop.targets) return false;
            const sopTargetIds = new Set(sop.targets.map(t => t.id));
            for (const reqId of Array.from(reqTargets)) {
                if (!sopTargetIds.has(reqId)) return false;
            }
            return true;
        });
    });

    toggleSample(sample: string) {
        this.state.update(s => {
            const newSet = new Set(s.selectedSamples);
            if (newSet.has(sample)) newSet.delete(sample); else newSet.add(sample);
            return { ...s, selectedSamples: newSet };
        });
    }

    selectAllSamples() { this.state.update(s => ({ ...s, selectedSamples: new Set(s.availableSamples) })); }
    deselectAllSamples() { this.state.update(s => ({ ...s, selectedSamples: new Set() })); }

    toggleTarget(id: string) {
        this.state.update(s => {
            const newSet = new Set(s.selectedTargets);
            if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
            return { ...s, selectedTargets: newSet };
        });
    }

    selectAllTargets() { this.state.update(s => ({ ...s, selectedTargets: new Set(s.availableTargets.map(t => t.id)) })); }
    deselectAllTargets() { this.state.update(s => ({ ...s, selectedTargets: new Set() })); }

    selectSop(id: string) { this.state.update(s => ({ ...s, selectedSopId: id })); }

    nextStep() {
        this.state.update(s => {
            if (s.step === 1) {
                if (s.selectedSamples.size === 0) return s;
                const relevantTargets = new Set<string>();
                if (this.sourceBatch.tasks) {
                    this.sourceBatch.tasks.forEach(t => {
                        if (s.selectedSamples.has(t.sample)) relevantTargets.add(t.targetId);
                    });
                } else {
                    s.availableTargets.forEach(t => relevantTargets.add(t.id));
                }
                return { ...s, step: 2, selectedTargets: relevantTargets };
            }
            if (s.step === 2 && s.selectedTargets.size === 0) return s;
            return { ...s, step: (s.step + 1) as any };
        });
    }

    prevStep() {
        this.state.update(s => {
            if (s.step === 1) return s;
            return { ...s, step: (s.step - 1) as any };
        });
    }

    confirm() {
        const s = this.state();
        if (s.selectedSopId) {
            this.execute.emit({
                samples: s.selectedSamples,
                targets: s.selectedTargets,
                sopId: s.selectedSopId
            });
        }
    }
}
