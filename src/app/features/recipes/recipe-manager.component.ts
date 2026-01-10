
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecipeService } from './recipe.service';
import { InventoryService } from '../inventory/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { Recipe } from '../../core/models/recipe.model';
import { InventoryItem } from '../../core/models/inventory.model';
import { generateSlug, UNIT_OPTIONS, formatNum } from '../../shared/utils/utils';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-recipe-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="h-full flex flex-col fade-in relative pb-10">
        
        <!-- Header Actions (No title, title is in tabs) -->
        <div class="flex justify-end mb-4 shrink-0">
            @if(auth.canEditRecipes()) {
                <button (click)="openModal()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95">
                    <i class="fa-solid fa-plus"></i> Tạo Công thức
                </button>
            }
        </div>

        @if(accessDenied()) {
            <div class="flex items-center justify-center h-64 bg-red-50 rounded-2xl border border-red-100">
                <div class="text-center">
                    <i class="fa-solid fa-lock text-red-300 text-4xl mb-3"></i>
                    <h3 class="text-red-800 font-bold text-lg">Không có quyền truy cập</h3>
                    <p class="text-red-600 text-sm mt-1">Bạn không có quyền xem thư viện công thức.</p>
                </div>
            </div>
        } @else {
            <!-- List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar p-1">
                @for (recipe of recipes(); track recipe.id) {
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group relative hover:border-purple-300 flex flex-col">
                        <div class="flex justify-between items-start mb-3">
                            <span class="bg-purple-50 text-purple-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-purple-100">
                                {{recipe.baseUnit}}
                            </span>
                            @if(auth.canEditRecipes()) {
                                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                    <button (click)="openModal(recipe)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition shadow-sm">
                                        <i class="fa-solid fa-pen text-[10px]"></i>
                                    </button>
                                    <button (click)="deleteRecipe(recipe)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition shadow-sm">
                                        <i class="fa-solid fa-trash text-[10px]"></i>
                                    </button>
                                </div>
                            }
                        </div>
                        
                        <h3 class="font-bold text-slate-800 text-lg mb-4 line-clamp-2 leading-snug" [title]="'ID: ' + recipe.id">
                            {{recipe.name}}
                        </h3>
                        
                        <div class="space-y-2 border-t border-slate-50 pt-3 mt-auto">
                            @for (ing of recipe.ingredients; track ing.name) {
                                <div class="flex justify-between text-xs items-center">
                                    <div class="flex items-center gap-1.5 overflow-hidden">
                                        <div class="w-1.5 h-1.5 rounded-full bg-purple-200 shrink-0"></div>
                                        <span class="text-slate-600 font-medium truncate" [title]="ing.displayName || ing.name">{{ing.displayName || ing.name}}</span>
                                    </div>
                                    <span class="text-slate-700 font-bold font-mono whitespace-nowrap">{{formatNum(ing.amount)}} <span class="text-[10px] font-normal text-slate-400">{{ing.unit}}</span></span>
                                </div>
                            }
                        </div>
                    </div>
                } @empty {
                    <div class="col-span-full py-20 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <i class="fa-solid fa-flask text-3xl mb-3 text-slate-300"></i>
                        <p>Chưa có công thức nào. Nhấn "Tạo Công thức" để thêm mới.</p>
                    </div>
                }
            </div>
        }

        <!-- Modal -->
        @if (showModal()) {
            <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-flask text-purple-600"></i>
                            {{ isEditing() ? 'Cập nhật Công thức' : 'Tạo Công thức Mới' }}
                        </h3>
                        <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                        <form [formGroup]="form" class="space-y-6">
                            <!-- Basic Info -->
                            <div class="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-4">
                                <div>
                                    <label class="text-xs font-bold text-purple-800 uppercase block mb-1.5">Tên hiển thị <span class="text-red-500">*</span></label>
                                    <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-purple-200 rounded-lg p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500 bg-white placeholder-purple-300" placeholder="VD: Hỗn hợp Muối A">
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-xs font-bold text-slate-500 uppercase block mb-1">ID (Slug)</label>
                                        <input formControlName="id" [readonly]="isEditing()" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs bg-slate-100 outline-none font-mono text-slate-600">
                                    </div>
                                    <div>
                                        <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Đơn vị thành phẩm</label>
                                        <select formControlName="baseUnit" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white">
                                            @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Ingredients -->
                            <div>
                                <div class="flex justify-between items-center mb-3">
                                    <label class="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                                        <i class="fa-solid fa-layer-group text-slate-400"></i> Thành phần (Từ Kho)
                                    </label>
                                    <button type="button" (click)="addIngredient()" class="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 transition">+ Thêm dòng</button>
                                </div>
                                
                                <div formArrayName="ingredients" class="space-y-3">
                                    @for (ing of ingredients.controls; track ing; let i = $index) {
                                        <div [formGroupName]="i" class="flex gap-2 items-center relative z-0 p-2 bg-slate-50 rounded-xl border border-slate-100 group transition hover:border-purple-200 hover:bg-purple-50/50" [style.zIndex]="100-i">
                                            <div class="w-6 h-6 rounded bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">{{i+1}}</div>
                                            
                                            <!-- Search Component -->
                                            <div class="flex-1 relative">
                                                <input formControlName="_displayName" 
                                                       (input)="onSearchInput($event, i)"
                                                       (focus)="onSearchFocus(i)"
                                                       class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-purple-500 bg-white shadow-sm" 
                                                       placeholder="Nhập tên hóa chất...">
                                                <input formControlName="name" type="hidden">
                                                
                                                @if(activeSearchIndex === i && searchResults().length > 0) {
                                                    <div class="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto z-50 custom-scrollbar">
                                                        @for (item of searchResults(); track item.id) {
                                                            <div (click)="selectItem(item, i)" class="px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center group/item">
                                                                <div class="truncate pr-2">
                                                                    <div class="text-xs font-bold text-slate-700 group-hover/item:text-purple-700 truncate">{{item.name}}</div>
                                                                    <div class="text-[10px] text-slate-400 font-mono">{{item.id}}</div>
                                                                </div>
                                                                <div class="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{{item.unit}}</div>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>

                                            <input formControlName="amount" type="number" class="w-20 border border-slate-300 rounded-lg px-2 py-2 text-xs text-center font-bold outline-none focus:border-purple-500" placeholder="Lượng">
                                            <select formControlName="unit" class="w-20 border border-slate-300 rounded-lg px-2 py-2 text-xs outline-none bg-white">
                                                @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                            </select>
                                            <button type="button" (click)="ingredients.removeAt(i)" class="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"><i class="fa-solid fa-times"></i></button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button (click)="closeModal()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Hủy bỏ</button>
                        <button (click)="save()" [disabled]="form.invalid" class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">Lưu Công thức</button>
                    </div>
                </div>
            </div>
        }
    </div>
  `
})
export class RecipeManagerComponent implements OnInit, OnDestroy {
  recipeService = inject(RecipeService);
  inventoryService = inject(InventoryService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  fb = inject(FormBuilder);
  formatNum = formatNum;
  unitOptions = UNIT_OPTIONS;

  recipes = signal<Recipe[]>([]);
  showModal = signal(false);
  isEditing = signal(false);
  accessDenied = signal(false);

  // Search
  searchSubject = new Subject<string>();
  searchResults = signal<InventoryItem[]>([]);
  activeSearchIndex: number | null = null;

  form = this.fb.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    baseUnit: ['tube', Validators.required],
    ingredients: this.fb.array([])
  });

  constructor() {
      this.searchSubject.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(term => term ? this.inventoryService.getInventoryPage(10, null, 'all', term).then(p => p.items) : of([]))
      ).subscribe(items => this.searchResults.set(items));
  }

  ngOnInit() { 
      if (!this.auth.canViewRecipes()) {
          this.accessDenied.set(true);
      } else {
          this.loadRecipes(); 
      }
  }
  ngOnDestroy() { this.searchSubject.complete(); }

  async loadRecipes() {
      try {
          const data = await this.recipeService.getAllRecipes();
          this.recipes.set(data);
          this.accessDenied.set(false);
      } catch (e: any) {
          console.error("Error loading recipes:", e);
          if (e.code === 'permission-denied') {
              this.accessDenied.set(true);
              this.toast.show('Không có quyền truy cập Công thức.', 'error');
          } else {
              this.toast.show('Lỗi tải công thức: ' + e.message, 'error');
          }
      }
  }

  // --- Form & Search ---
  get ingredients() { return this.form.get('ingredients') as FormArray; }

  addIngredient() {
      this.ingredients.push(this.fb.group({
          name: ['', Validators.required],
          _displayName: ['', Validators.required],
          amount: [0, Validators.required],
          unit: ['g', Validators.required]
      }));
  }

  onNameChange(e: any) {
      if(!this.isEditing()) {
          this.form.patchValue({ id: 'recipe_' + generateSlug(e.target.value) });
      }
  }

  onSearchInput(e: any, index: number) {
      this.activeSearchIndex = index;
      this.searchSubject.next(e.target.value);
  }
  
  onSearchFocus(index: number) {
      this.activeSearchIndex = index;
      const val = this.ingredients.at(index).get('_displayName')?.value;
      if(val) this.searchSubject.next(val);
  }

  selectItem(item: InventoryItem, index: number) {
      this.ingredients.at(index).patchValue({
          name: item.id,
          _displayName: item.name,
          unit: item.unit
      });
      this.activeSearchIndex = null;
      this.searchResults.set([]);
  }

  // --- Actions ---
  openModal(recipe?: Recipe) {
      if (!this.auth.canEditRecipes()) {
          this.toast.show('Bạn chỉ có quyền xem.', 'error');
          return;
      }
      this.showModal.set(true);
      this.ingredients.clear();
      this.searchResults.set([]);
      this.activeSearchIndex = null;

      if (recipe) {
          this.isEditing.set(true);
          this.form.patchValue({ id: recipe.id, name: recipe.name, baseUnit: recipe.baseUnit });
          this.form.controls.id.disable();
          recipe.ingredients.forEach(ing => {
              this.ingredients.push(this.fb.group({
                  name: [ing.name, Validators.required],
                  _displayName: [ing.displayName || ing.name, Validators.required],
                  amount: [ing.amount, Validators.required],
                  unit: [ing.unit, Validators.required]
              }));
          });
      } else {
          this.isEditing.set(false);
          this.form.reset({ baseUnit: 'tube' });
          this.form.controls.id.enable();
          this.addIngredient();
      }
  }

  closeModal() { this.showModal.set(false); }

  async save() {
      if (!this.auth.canEditRecipes()) return;
      if (this.form.invalid) return;
      const val = this.form.getRawValue();
      const recipe: Recipe = {
          id: val.id!,
          name: val.name!,
          baseUnit: val.baseUnit!,
          ingredients: (val.ingredients as any[]).map(i => ({
              name: i.name, displayName: i._displayName, amount: i.amount, unit: i.unit
          }))
      };

      try {
          await this.recipeService.saveRecipe(recipe);
          this.toast.show('Đã lưu công thức!', 'success');
          this.closeModal();
          this.loadRecipes();
      } catch (e: any) {
          this.toast.show('Lỗi: ' + e.message, 'error');
      }
  }

  async deleteRecipe(r: Recipe) {
      if (!this.auth.canEditRecipes()) return;
      if(await this.confirmation.confirm(`Xóa công thức "${r.name}"?`)) {
          await this.recipeService.deleteRecipe(r.id);
          this.loadRecipes();
          this.toast.show('Đã xóa');
      }
  }
}
