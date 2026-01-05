
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SopService } from '../services/sop.service';
import { StateService } from '../services/state.service';
import { ToastService } from '../services/toast.service';
import { Sop } from '../models/sop.model';
import { UNIT_OPTIONS } from '../utils/utils';

@Component({
  selector: 'app-sop-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="h-full flex flex-col md:flex-row bg-slate-100 overflow-hidden fade-in">
       <!-- LEFT: List -->
       <div class="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
             <h3 class="font-bold text-slate-700">DS Quy trình</h3>
             <button (click)="createNew()" class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition font-bold shadow-sm flex items-center gap-1">
                <i class="fa-solid fa-plus"></i> Mới
             </button>
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-1">
             @for (sop of state.sops(); track sop.id) {
               <div (click)="loadSop(sop)" 
                    class="p-3 rounded cursor-pointer border transition text-sm group"
                    [class]="currentId() === sop.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent hover:bg-slate-50'">
                  <div class="font-bold text-slate-700 truncate group-hover:text-blue-600">{{sop.name}}</div>
                  <div class="text-xs text-slate-400 flex justify-between">
                     <span>{{sop.category}}</span>
                     @if(sop.ref) { <span class="text-[10px] bg-slate-100 px-1 rounded">{{sop.ref}}</span> }
                  </div>
               </div>
             }
          </div>
       </div>

       <!-- RIGHT: Editor Form -->
       <div class="flex-1 overflow-y-auto p-4 md:p-8">
          <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             
             <!-- Toolbar -->
             <div class="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                   @if(!currentId()) { <i class="fa-solid fa-file-circle-plus text-green-500"></i> }
                   @else { <i class="fa-solid fa-pen-to-square text-blue-500"></i> }
                   {{ currentId() ? 'Chỉnh sửa SOP' : 'Tạo SOP mới' }}
                </h2>
                <div class="flex gap-2">
                   @if(currentId()) {
                     <button (click)="deleteCurrent()" class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 text-sm font-bold transition">
                        <i class="fa-solid fa-trash"></i> Xóa
                     </button>
                   }
                   <button (click)="save()"
                           class="px-4 py-1.5 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-bold transition flex items-center gap-2">
                      <i class="fa-solid fa-save"></i> Lưu lại
                   </button>
                </div>
             </div>

             <form [formGroup]="form" class="p-6 space-y-8">
                
                <!-- 1. Basic Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div class="space-y-1">
                      <label class="text-xs font-bold text-slate-500 uppercase">Mã ID (Auto)</label>
                      <input formControlName="id" placeholder="(Tự động tạo)" class="w-full border border-slate-300 rounded p-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 text-slate-500" readonly>
                   </div>
                   <div class="space-y-1">
                      <label class="text-xs font-bold text-slate-500 uppercase">Danh mục <span class="text-red-500">*</span></label>
                      <input formControlName="category" class="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: PCR, Elisa...">
                   </div>
                   <div class="col-span-1 md:col-span-2 space-y-1">
                      <label class="text-xs font-bold text-slate-500 uppercase">Tên Quy trình <span class="text-red-500">*</span></label>
                      <input formControlName="name" class="w-full border border-slate-300 rounded p-2 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nhập tên quy trình...">
                   </div>
                   <div class="col-span-1 md:col-span-2 space-y-1">
                      <label class="text-xs font-bold text-slate-500 uppercase">Tham chiếu (Ref)</label>
                      <input formControlName="ref" class="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Mã tài liệu...">
                   </div>
                </div>

                <hr class="border-slate-100">

                <!-- 2. Inputs -->
                <div>
                   <div class="flex items-center justify-between mb-2">
                      <h3 class="font-bold text-slate-700 flex items-center gap-2">
                         <i class="fa-solid fa-sliders text-blue-500"></i> Tham số đầu vào (Inputs)
                      </h3>
                      <button type="button" (click)="addInput()" class="text-xs text-blue-600 hover:underline font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100">+ Thêm Input</button>
                   </div>
                   <div class="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100" formArrayName="inputs">
                      @for (inp of inputs.controls; track inp; let i = $index) {
                         <div [formGroupName]="i" class="flex gap-2 items-center">
                            <input formControlName="var" placeholder="Biến" class="w-1/5 p-2 text-xs border rounded font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" title="Tên biến dùng trong công thức">
                            <input formControlName="label" placeholder="Nhãn hiển thị" class="flex-1 p-2 text-xs border rounded focus:border-blue-500 outline-none">
                            
                            <select formControlName="type" class="w-20 p-2 text-xs border rounded bg-white outline-none">
                                <option value="number">Số</option>
                                <option value="checkbox">Check</option>
                            </select>
                            
                            <input formControlName="default" placeholder="Mặc định" class="w-16 p-2 text-xs border rounded text-center outline-none">
                            
                            <select formControlName="unitLabel" class="w-20 p-2 text-xs border rounded bg-white outline-none">
                                <option value="">(ĐV)</option>
                                @for (opt of unitOptions; track opt.value) {
                                    <option [value]="opt.value">{{opt.value}}</option>
                                }
                            </select>
                            
                            <button type="button" (click)="inputs.removeAt(i)" class="text-slate-400 hover:text-red-600 px-2 transition"><i class="fa-solid fa-times"></i></button>
                         </div>
                      }
                      @if (inputs.length === 0) { <div class="text-center text-xs text-slate-400 italic py-2">Chưa có tham số đầu vào. Nhấn "+ Thêm Input".</div> }
                   </div>
                </div>

                <!-- 3. Variables -->
                <div>
                   <div class="flex items-center justify-between mb-2">
                      <h3 class="font-bold text-slate-700 flex items-center gap-2">
                         <i class="fa-solid fa-calculator text-purple-500"></i> Công thức trung gian
                      </h3>
                      <button type="button" (click)="addVariable()" class="text-xs text-purple-600 hover:underline font-bold bg-purple-50 px-2 py-1 rounded border border-purple-100">+ Thêm Biến</button>
                   </div>
                   <div class="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-100" formArrayName="variablesList">
                      @for (v of variablesList.controls; track v; let i = $index) {
                         <div [formGroupName]="i" class="flex gap-2 items-center">
                            <input formControlName="key" placeholder="Biến (total_n)" class="w-1/3 p-2 text-xs border rounded font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none">
                            <span class="font-bold text-slate-400">=</span>
                            <input formControlName="formula" placeholder="Công thức" class="flex-1 p-2 text-xs border rounded font-mono text-purple-700 focus:border-purple-500 outline-none">
                            <button type="button" (click)="variablesList.removeAt(i)" class="text-slate-400 hover:text-red-600 px-2 transition"><i class="fa-solid fa-times"></i></button>
                         </div>
                      }
                      @if (variablesList.length === 0) { <div class="text-center text-xs text-slate-400 italic py-2">Không có biến trung gian.</div> }
                   </div>
                </div>

                <hr class="border-slate-100">

                <!-- 4. Consumables -->
                <div>
                   <div class="flex items-center justify-between mb-4">
                      <h3 class="font-bold text-slate-700 flex items-center gap-2">
                         <i class="fa-solid fa-box-open text-orange-500"></i> Vật tư tiêu hao
                      </h3>
                      <button type="button" (click)="addConsumable()" class="px-3 py-1 bg-slate-800 text-white text-xs rounded font-bold hover:bg-slate-700 transition shadow-sm">
                         + Thêm Dòng
                      </button>
                   </div>
                   
                   <div formArrayName="consumables" class="space-y-4">
                      @for (con of consumables.controls; track con; let i = $index) {
                         <div [formGroupName]="i" class="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm transition hover:shadow-md group">
                            <!-- Consumable Header -->
                            <div class="bg-slate-50 p-3 flex items-center gap-2 border-b border-slate-200 group-hover:bg-slate-100 transition">
                               <div class="font-bold text-slate-500 mr-2 w-6">#{{i+1}}</div>
                               <select formControlName="type" class="text-xs border-none bg-white py-1 px-2 rounded shadow-sm focus:ring-0 font-bold uppercase text-slate-600 cursor-pointer">
                                  <option value="simple">Single</option>
                                  <option value="composite">Composite</option>
                               </select>
                               <!-- Main Consumable Name (can be just a label if it's composite) -->
                               <input formControlName="name" placeholder="Tên hiển thị / Tên Hỗn hợp" class="flex-1 text-sm bg-transparent border-none focus:ring-0 font-bold placeholder-slate-400 text-slate-700">
                               <button type="button" (click)="consumables.removeAt(i)" class="text-slate-300 hover:text-red-600 px-2 transition"><i class="fa-solid fa-trash-alt"></i></button>
                            </div>

                            <div class="p-3 grid gap-3">
                               <!-- Common Fields -->
                               <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  <div>
                                     <label class="text-[10px] uppercase font-bold text-slate-400">Đơn vị</label>
                                     <select formControlName="unit" class="w-full border rounded p-1.5 text-xs outline-none bg-white">
                                        @for (opt of unitOptions; track opt.value) {
                                            <option [value]="opt.value">{{opt.value}}</option>
                                        }
                                     </select>
                                  </div>
                                  <div class="col-span-2">
                                     <label class="text-[10px] uppercase font-bold text-slate-400">Công thức</label>
                                     <input formControlName="formula" placeholder="VD: n_sample * 5" class="w-full border rounded p-1.5 text-xs font-mono text-blue-700 outline-none focus:border-blue-500">
                                  </div>
                                  <div>
                                     <label class="text-[10px] uppercase font-bold text-slate-400">Điều kiện</label>
                                     <input formControlName="condition" placeholder="VD: has_qc > 0" class="w-full border rounded p-1.5 text-xs font-mono text-purple-600 outline-none focus:border-purple-500">
                                  </div>
                               </div>
                               
                               <!-- Ingredients (Only for Composite) -->
                               @if (con.get('type')?.value === 'composite') {
                                  <div class="bg-blue-50/50 rounded p-3 border border-blue-100 mt-2">
                                     <div class="flex justify-between items-center mb-2">
                                        <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">Thành phần con</span>
                                        <button type="button" (click)="addIngredient(i)" class="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold hover:bg-blue-300 transition">+ Thêm</button>
                                     </div>
                                     <div formArrayName="ingredients" class="space-y-2">
                                        @for (ing of getIngredients(i).controls; track ing; let j = $index) {
                                           <div [formGroupName]="j" class="flex gap-2 items-center">
                                              <!-- Ingredient Name Selector (Linked to Inventory) -->
                                              <div class="flex-1 relative">
                                                 <select formControlName="name" class="w-full border rounded p-1.5 text-xs outline-none focus:border-blue-500 bg-white">
                                                    <option value="" disabled>-- Chọn hóa chất --</option>
                                                    @for (item of state.inventory(); track item.id) {
                                                       <option [value]="item.id">{{item.name || item.id}} ({{item.unit}})</option>
                                                    }
                                                 </select>
                                              </div>

                                              <input formControlName="amount" type="number" placeholder="Lượng" class="w-16 border rounded p-1.5 text-xs text-center outline-none focus:border-blue-500">
                                              
                                              <select formControlName="unit" class="w-16 border rounded p-1.5 text-xs text-center outline-none bg-white">
                                                  @for (opt of unitOptions; track opt.value) {
                                                    <option [value]="opt.value">{{opt.value}}</option>
                                                  }
                                              </select>

                                              <button type="button" (click)="getIngredients(i).removeAt(j)" class="text-red-300 hover:text-red-500 px-1"><i class="fa-solid fa-times"></i></button>
                                           </div>
                                        }
                                        @if (getIngredients(i).length === 0) { <div class="text-center text-[10px] text-blue-400 italic">Chưa có thành phần.</div> }
                                     </div>
                                  </div>
                               }
                            </div>
                         </div>
                      }
                      @if (consumables.length === 0) {
                         <div class="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                            <i class="fa-solid fa-box-open text-slate-300 text-3xl mb-2"></i>
                            <p class="text-sm text-slate-400">Chưa có hóa chất nào.<br>Nhấn "+ Thêm Dòng" để bắt đầu.</p>
                         </div>
                      }
                   </div>
                </div>

             </form>
          </div>
       </div>
    </div>
  `
})
export class SopEditorComponent implements OnInit {
  state = inject(StateService);
  sopService = inject(SopService);
  toast = inject(ToastService);
  fb: FormBuilder = inject(FormBuilder);
  
  unitOptions = UNIT_OPTIONS;
  currentId = signal<string | null>(null);

  form = this.fb.group({
    id: [''],
    category: ['', Validators.required],
    name: ['', Validators.required],
    ref: [''],
    inputs: this.fb.array([]),
    variablesList: this.fb.array([]),
    consumables: this.fb.array([])
  });

  get inputs() { return this.form.get('inputs') as FormArray; }
  get variablesList() { return this.form.get('variablesList') as FormArray; }
  get consumables() { return this.form.get('consumables') as FormArray; }
  
  ngOnInit() {
     // Default to new SOP if none selected
     if (!this.currentId()) {
        this.createNew();
     }
  }

  getIngredients(conIndex: number): FormArray {
    return this.consumables.at(conIndex).get('ingredients') as FormArray;
  }

  // --- Actions ---

  createNew() {
    this.currentId.set(null);
    this.form.reset({ id: '', category: 'General', name: '', ref: '' });
    this.inputs.clear();
    this.variablesList.clear();
    this.consumables.clear();
    
    // Default Inputs
    this.addInputRaw('n_sample', 'Số mẫu', 1, 'number', 1, '');
  }

  loadSop(sop: Sop) {
    this.currentId.set(sop.id);
    this.form.patchValue({
      id: sop.id,
      category: sop.category,
      name: sop.name,
      ref: sop.ref
    });

    // Inputs
    this.inputs.clear();
    sop.inputs.forEach(i => this.addInputRaw(i.var, i.label, i.default, i.type, i.step, i.unitLabel));

    // Variables
    this.variablesList.clear();
    if (sop.variables) {
      Object.entries(sop.variables).forEach(([k, v]) => {
         const g = this.fb.group({ key: [k, Validators.required], formula: [v, Validators.required] });
         this.variablesList.push(g);
      });
    }

    // Consumables
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
  }

  async save() {
    // 1. Auto Generate ID if missing
    let formVal = this.form.value;
    if (!formVal.id) {
       const newId = `sop_${Date.now()}`;
       this.form.patchValue({ id: newId });
       formVal = this.form.value; // update local
    }

    if (this.form.invalid) {
       this.form.markAllAsTouched();
       return this.toast.show('Vui lòng nhập Tên và Danh mục!', 'error');
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
      }))
    };

    try {
      await this.sopService.saveSop(sop);
      this.toast.show('Đã lưu quy trình thành công');
      
      // If it was new, set it as current so we don't accidentally create duplicates
      if (!this.currentId()) {
         this.currentId.set(sop.id);
      }
    } catch(e) {
      console.error(e);
      this.toast.show('Lỗi lưu SOP', 'error');
    }
  }

  async deleteCurrent() {
    const id = this.currentId();
    if (id && confirm('Xóa SOP này?')) {
       await this.sopService.deleteSop(id);
       this.toast.show('Đã xóa SOP');
       this.createNew();
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
