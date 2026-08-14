
import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
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

import { LockPermissionDirective } from '../../shared/directives/lock-permission.directive';
import { StateService } from '../../core/services/state.service';
import { AppButtonComponent, AppEmptyStateComponent, AppModalShellComponent, AppPageHeaderComponent, AppToolbarComponent } from '../../shared/components/ui';

@Component({
  selector: 'app-recipe-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LockPermissionDirective, AppButtonComponent, AppEmptyStateComponent, AppModalShellComponent, AppPageHeaderComponent, AppToolbarComponent],
  template: `
    <div class="flex flex-col flex-1 min-h-0 fade-in relative pb-10 bg-transparent dark:text-slate-100">

        <app-page-header
            title="Thư viện công thức"
            subtitle="Quản lý các công thức dùng chung cho tính toán và chuẩn bị mẫu."
            icon="fa-book-bookmark">
            @if(auth.canEditRecipes() || state.showLockedFeatures()) {
                <div pageHeaderActions class="contents">
                    <app-button [appLockPermission]="'recipe_edit'" (click)="openModal()">
                        <i class="fa-solid fa-plus" aria-hidden="true"></i> Tạo công thức
                    </app-button>
                </div>
            }
        </app-page-header>

        @if(accessDenied()) {
            <div class="flex items-center justify-center h-64 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-100 dark:border-red-900/50">
                <div class="text-center">
                    <i class="fa-solid fa-lock text-red-300 text-4xl mb-3"></i>
                    <h3 class="text-red-800 dark:text-red-200 font-bold text-lg">Không có quyền truy cập</h3>
                    <p class="text-red-600 dark:text-red-300 text-sm mt-1">Bạn không có quyền xem thư viện công thức.</p>
                </div>
            </div>
        } @else {
            <app-toolbar>
                <div toolbarSearch class="relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden="true"></i>
                    <input
                        [ngModel]="recipeSearchTerm()"
                        (ngModelChange)="recipeSearchTerm.set($event)"
                        class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        placeholder="Tìm công thức theo tên, ID hoặc thành phần..."
                        aria-label="Tìm công thức">
                </div>
                @if (recipeSearchTerm()) {
                    <div toolbarActions class="contents">
                        <app-button variant="ghost" size="sm" (click)="recipeSearchTerm.set('')">Xóa tìm kiếm</app-button>
                    </div>
                }
            </app-toolbar>

            <!-- List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar p-1">
                @for (recipe of filteredRecipes(); track recipe.id) {
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group relative hover:border-indigo-300 dark:hover:border-indigo-700 flex flex-col">
                        <div class="flex justify-between items-start mb-3">
                            <span class="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/50">
                                {{recipe.baseUnit}}
                            </span>
                            @if(auth.canEditRecipes() || state.showLockedFeatures()) {
                                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                    <button [appLockPermission]="'recipe_edit'" (click)="openModal(recipe)" aria-label="Sửa công thức" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition shadow-sm">
                                        <i class="fa-solid fa-pen text-[10px]" aria-hidden="true"></i>
                                    </button>
                                    <button [appLockPermission]="'recipe_edit'" (click)="deleteRecipe(recipe)" aria-label="Xóa công thức" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-300 dark:hover:border-red-700 transition shadow-sm">
                                        <i class="fa-solid fa-trash text-[10px]" aria-hidden="true"></i>
                                    </button>
                                </div>
                            }
                        </div>
                        
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4 line-clamp-2 leading-snug" [title]="'ID: ' + recipe.id">
                            {{recipe.name}}
                        </h3>
                        
                        <div class="space-y-2 border-t border-slate-50 dark:border-slate-700 pt-3 mt-auto">
                            @for (ing of recipe.ingredients; track ing.name) {
                                <div class="flex justify-between text-xs items-center">
                                    <div class="flex items-center gap-1.5 overflow-hidden">
                                        <div class="w-1.5 h-1.5 rounded-full bg-purple-200 shrink-0"></div>
                                        <span class="text-slate-600 dark:text-slate-300 font-medium truncate" [title]="ing.displayName || ing.name">{{ing.displayName || ing.name}}</span>
                                    </div>
                                    <span class="text-slate-700 dark:text-slate-200 font-bold font-mono whitespace-nowrap">{{formatNum(ing.amount)}} <span class="text-[10px] font-normal text-slate-400">{{ing.unit}}</span></span>
                                </div>
                            }
                        </div>
                    </div>
                } @empty {
                    <div class="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60">
                        @if (recipes().length === 0) {
                            <app-empty-state
                                icon="fa-flask"
                                title="Chưa có công thức"
                                message="Nhấn “Tạo công thức” để thêm mới."
                            />
                        } @else {
                            <app-empty-state
                                icon="fa-magnifying-glass"
                                title="Không tìm thấy công thức"
                                message="Thử thay đổi từ khóa tìm kiếm.">
                                <app-button emptyStateActions variant="secondary" size="sm" (click)="recipeSearchTerm.set('')">Xóa tìm kiếm</app-button>
                            </app-empty-state>
                        }
                    </div>
                }
            </div>
        }

        <!-- Modal -->
        @if (showModal()) {
            <app-modal-shell
                [title]="isEditing() ? 'Cập nhật công thức' : 'Tạo công thức mới'"
                size="md"
                (closed)="closeModal()"
            >
                <form modalBody [formGroup]="form" class="space-y-6">
                            <!-- Basic Info -->
                            <div class="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-4">
                                <div>
                                    <label class="text-xs font-bold text-indigo-800 dark:text-indigo-200 uppercase block mb-1.5">Tên hiển thị <span class="text-red-500">*</span></label>
                                    <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 placeholder-indigo-300" placeholder="VD: Hỗn hợp Muối A">
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">ID (Slug)</label>
                                        <input formControlName="id" [readonly]="isEditing()" class="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-xs bg-slate-100 dark:bg-slate-700 outline-none font-mono text-slate-600 dark:text-slate-300">
                                    </div>
                                    <div>
                                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Đơn vị thành phẩm</label>
                                        <select formControlName="baseUnit" class="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-sm outline-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                                            @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Ingredients -->
                            <div>
                                <div class="flex justify-between items-center mb-3">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center gap-2">
                                        <i class="fa-solid fa-layer-group text-slate-400"></i> Thành phần (từ kho)
                                    </label>
                                    <app-button type="button" variant="secondary" size="sm" (click)="addIngredient()">
                                        <i class="fa-solid fa-plus" aria-hidden="true"></i> Thêm dòng
                                    </app-button>
                                </div>
                                
                                <div formArrayName="ingredients" class="space-y-3">
                                    @for (ing of ingredients.controls; track ing; let i = $index) {
                                        <div [formGroupName]="i" class="flex gap-2 items-center relative z-0 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700 group transition hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20" [style.zIndex]="100-i">
                                            <div class="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">{{i+1}}</div>
                                            
                                            <!-- Search Component -->
                                            <div class="flex-1 relative">
                                                <input formControlName="_displayName" 
                                                       (input)="onSearchInput($event, i)"
                                                       (focus)="onSearchFocus(i)"
                                                       class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 bg-white dark:bg-slate-800 shadow-sm"
                                                       placeholder="Nhập tên hóa chất...">
                                                <input formControlName="name" type="hidden">
                                                
                                                @if(activeSearchIndex === i && searchResults().length > 0) {
                                                    <div class="absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto z-50 custom-scrollbar">
                                                        @for (item of searchResults(); track item.id) {
                                                            <div (click)="selectItem(item, i)" class="px-3 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer border-b border-slate-50 dark:border-slate-700 last:border-0 flex justify-between items-center group/item">
                                                                <div class="truncate pr-2">
                                                                    <div class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-300 truncate">{{item.name}}</div>
                                                                    <div class="text-[10px] text-slate-400 font-mono">{{item.id}}</div>
                                                                </div>
                                                                <div class="text-[9px] font-bold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded shrink-0">{{item.unit}}</div>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>

                                            <input formControlName="amount" type="number" class="w-20 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-2 text-xs text-center font-bold outline-none focus:border-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100" placeholder="Lượng">
                                            <select formControlName="unit" class="w-20 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-2 text-xs outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                                                @for (opt of unitOptions; track opt.value) { <option [value]="opt.value">{{opt.value}}</option> }
                                            </select>
                                            <button type="button" (click)="ingredients.removeAt(i)" aria-label="Xóa dòng thành phần" class="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition"><i class="fa-solid fa-xmark"></i></button>
                                        </div>
                                    }
                                </div>
                            </div>
                </form>

                <div modalFooter class="contents">
                    <app-button variant="secondary" (click)="closeModal()">Hủy</app-button>
                    <app-button (click)="save()" [disabled]="form.invalid">Lưu</app-button>
                </div>
            </app-modal-shell>
        }
    </div>
  `
})
export class RecipeManagerComponent implements OnInit, OnDestroy {
  recipeService = inject(RecipeService);
  inventoryService = inject(InventoryService);
  auth = inject(AuthService);
  state = inject(StateService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);
  fb: FormBuilder = inject(FormBuilder);
  formatNum = formatNum;
  unitOptions = UNIT_OPTIONS;

  recipes = signal<Recipe[]>([]);
  recipeSearchTerm = signal('');
  filteredRecipes = computed(() => {
      const term = this.recipeSearchTerm().trim().toLocaleLowerCase('vi');
      if (!term) return this.recipes();

      return this.recipes().filter(recipe => {
          const searchable = [
              recipe.id,
              recipe.name,
              recipe.baseUnit,
              ...recipe.ingredients.flatMap(ingredient => [ingredient.name, ingredient.displayName ?? '', ingredient.unit])
          ].join(' ').toLocaleLowerCase('vi');
          return searchable.includes(term);
      });
  });
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
