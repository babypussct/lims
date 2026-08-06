import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RecipeService } from './recipe.service';
import { InventoryService } from '../inventory/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { generateSlug, UNIT_OPTIONS, formatNum } from '../../shared/utils/utils';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { LockPermissionDirective } from '../../shared/directives/lock-permission.directive';
import { StateService } from '../../core/services/state.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.name;
const _forTrack2 = ($index, $item) => $item.value;
function RecipeManagerComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 6);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openModal()); });
    i0.ɵɵelement(1, "i", 7);
    i0.ɵɵtext(2, " T\u1EA1o C\u00F4ng Th\u1EE9c ");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("appLockPermission", "recipe_edit");
} }
function RecipeManagerComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 8);
    i0.ɵɵelement(2, "i", 9);
    i0.ɵɵelementStart(3, "h3", 10);
    i0.ɵɵtext(4, "Kh\u00F4ng C\u00F3 Quy\u1EC1n Truy C\u1EADp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 11);
    i0.ɵɵtext(6, "B\u1EA1n kh\u00F4ng c\u00F3 quy\u1EC1n xem th\u01B0 vi\u1EC7n c\u00F4ng th\u1EE9c.");
    i0.ɵɵelementEnd()()();
} }
function RecipeManagerComponent_Conditional_4_For_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "button", 20);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_4_For_2_Conditional_4_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r3); const recipe_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.openModal(recipe_r4)); });
    i0.ɵɵelement(2, "i", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "button", 22);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_4_For_2_Conditional_4_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r3); const recipe_r4 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.deleteRecipe(recipe_r4)); });
    i0.ɵɵelement(4, "i", 23);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("appLockPermission", "recipe_edit");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("appLockPermission", "recipe_edit");
} }
function RecipeManagerComponent_Conditional_4_For_2_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19)(1, "div", 24);
    i0.ɵɵelement(2, "div", 25);
    i0.ɵɵelementStart(3, "span", 26);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(5, "span", 27);
    i0.ɵɵtext(6);
    i0.ɵɵelementStart(7, "span", 28);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ing_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("title", ing_r5.displayName || ing_r5.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ing_r5.displayName || ing_r5.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.formatNum(ing_r5.amount), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ing_r5.unit);
} }
function RecipeManagerComponent_Conditional_4_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12)(1, "div", 14)(2, "span", 15);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, RecipeManagerComponent_Conditional_4_For_2_Conditional_4_Template, 5, 2, "div", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h3", 17);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 18);
    i0.ɵɵrepeaterCreate(8, RecipeManagerComponent_Conditional_4_For_2_For_9_Template, 9, 4, "div", 19, _forTrack1);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const recipe_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", recipe_r4.baseUnit, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.auth.canEditRecipes() || ctx_r1.state.showLockedFeatures() ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", "ID: " + recipe_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", recipe_r4.name, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(recipe_r4.ingredients);
} }
function RecipeManagerComponent_Conditional_4_ForEmpty_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵelement(1, "i", 29);
    i0.ɵɵelementStart(2, "p");
    i0.ɵɵtext(3, "Ch\u01B0a c\u00F3 c\u00F4ng th\u1EE9c n\u00E0o. Nh\u1EA5n \"T\u1EA1o c\u00F4ng th\u1EE9c\" \u0111\u1EC3 th\u00EAm m\u1EDBi.");
    i0.ɵɵelementEnd()();
} }
function RecipeManagerComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵrepeaterCreate(1, RecipeManagerComponent_Conditional_4_For_2_Template, 10, 4, "div", 12, _forTrack0, false, RecipeManagerComponent_Conditional_4_ForEmpty_3_Template, 4, 0, "div", 13);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.recipes());
} }
function RecipeManagerComponent_Conditional_5_For_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 46);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r7 = ctx.$implicit;
    i0.ɵɵproperty("value", opt_r7.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(opt_r7.value);
} }
function RecipeManagerComponent_Conditional_5_For_37_Conditional_6_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 66);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_5_For_37_Conditional_6_For_2_Template_div_click_0_listener() { const item_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ɵ$index_141_r9 = i0.ɵɵnextContext(2).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectItem(item_r11, ɵ$index_141_r9)); });
    i0.ɵɵelementStart(1, "div", 67)(2, "div", 68);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 69);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 70);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r11 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r11.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r11.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r11.unit);
} }
function RecipeManagerComponent_Conditional_5_For_37_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 61);
    i0.ɵɵrepeaterCreate(1, RecipeManagerComponent_Conditional_5_For_37_Conditional_6_For_2_Template, 8, 3, "div", 65, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.searchResults());
} }
function RecipeManagerComponent_Conditional_5_For_37_For_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 46);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r12 = ctx.$implicit;
    i0.ɵɵproperty("value", opt_r12.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(opt_r12.value);
} }
function RecipeManagerComponent_Conditional_5_For_37_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 56)(1, "div", 57);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 58)(4, "input", 59);
    i0.ɵɵlistener("input", function RecipeManagerComponent_Conditional_5_For_37_Template_input_input_4_listener($event) { const ɵ$index_141_r9 = i0.ɵɵrestoreView(_r8).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onSearchInput($event, ɵ$index_141_r9)); })("focus", function RecipeManagerComponent_Conditional_5_For_37_Template_input_focus_4_listener() { const ɵ$index_141_r9 = i0.ɵɵrestoreView(_r8).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onSearchFocus(ɵ$index_141_r9)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "input", 60);
    i0.ɵɵtemplate(6, RecipeManagerComponent_Conditional_5_For_37_Conditional_6_Template, 3, 0, "div", 61);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(7, "input", 62);
    i0.ɵɵelementStart(8, "select", 63);
    i0.ɵɵrepeaterCreate(9, RecipeManagerComponent_Conditional_5_For_37_For_10_Template, 2, 2, "option", 46, _forTrack2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "button", 64);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_5_For_37_Template_button_click_11_listener() { const ɵ$index_141_r9 = i0.ɵɵrestoreView(_r8).$index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.ingredients.removeAt(ɵ$index_141_r9)); });
    i0.ɵɵelement(12, "i", 35);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ɵ$index_141_r9 = ctx.$index;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵstyleProp("z-index", 100 - ɵ$index_141_r9);
    i0.ɵɵproperty("formGroupName", ɵ$index_141_r9);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ɵ$index_141_r9 + 1);
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.activeSearchIndex === ɵ$index_141_r9 && ctx_r1.searchResults().length > 0 ? 6 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r1.unitOptions);
} }
function RecipeManagerComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 30)(2, "div", 31)(3, "h3", 32);
    i0.ɵɵelement(4, "i", 33);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 34);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_5_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal()); });
    i0.ɵɵelement(7, "i", 35);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 36)(9, "form", 37)(10, "div", 38)(11, "div")(12, "label", 39);
    i0.ɵɵtext(13, "T\u00EAn hi\u1EC3n th\u1ECB ");
    i0.ɵɵelementStart(14, "span", 40);
    i0.ɵɵtext(15, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "input", 41);
    i0.ɵɵlistener("input", function RecipeManagerComponent_Conditional_5_Template_input_input_16_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onNameChange($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "div", 42)(18, "div")(19, "label", 43);
    i0.ɵɵtext(20, "ID (Slug)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(21, "input", 44);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "div")(23, "label", 43);
    i0.ɵɵtext(24, "\u0110\u01A1n v\u1ECB th\u00E0nh ph\u1EA9m");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "select", 45);
    i0.ɵɵrepeaterCreate(26, RecipeManagerComponent_Conditional_5_For_27_Template, 2, 2, "option", 46, _forTrack2);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(28, "div")(29, "div", 47)(30, "label", 48);
    i0.ɵɵelement(31, "i", 49);
    i0.ɵɵtext(32, " Th\u00E0nh ph\u1EA7n (t\u1EEB kho) ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(33, "button", 50);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_5_Template_button_click_33_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addIngredient()); });
    i0.ɵɵtext(34, "+ Th\u00EAm D\u00F2ng");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(35, "div", 51);
    i0.ɵɵrepeaterCreate(36, RecipeManagerComponent_Conditional_5_For_37_Template, 13, 5, "div", 52, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(38, "div", 53)(39, "button", 54);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_5_Template_button_click_39_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeModal()); });
    i0.ɵɵtext(40, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "button", 55);
    i0.ɵɵlistener("click", function RecipeManagerComponent_Conditional_5_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.save()); });
    i0.ɵɵtext(42, "L\u01B0u C\u00F4ng Th\u1EE9c");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isEditing() ? "C\u1EADp nh\u1EADt c\u00F4ng th\u1EE9c" : "T\u1EA1o c\u00F4ng th\u1EE9c M\u1EDBi", " ");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("readonly", ctx_r1.isEditing());
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r1.unitOptions);
    i0.ɵɵadvance(10);
    i0.ɵɵrepeater(ctx_r1.ingredients.controls);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r1.form.invalid);
} }
export class RecipeManagerComponent {
    constructor() {
        this.recipeService = inject(RecipeService);
        this.inventoryService = inject(InventoryService);
        this.auth = inject(AuthService);
        this.state = inject(StateService);
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.fb = inject(FormBuilder);
        this.formatNum = formatNum;
        this.unitOptions = UNIT_OPTIONS;
        this.recipes = signal([]);
        this.showModal = signal(false);
        this.isEditing = signal(false);
        this.accessDenied = signal(false);
        // Search
        this.searchSubject = new Subject();
        this.searchResults = signal([]);
        this.activeSearchIndex = null;
        this.form = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            baseUnit: ['tube', Validators.required],
            ingredients: this.fb.array([])
        });
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), switchMap(term => term ? this.inventoryService.getInventoryPage(10, null, 'all', term).then(p => p.items) : of([]))).subscribe(items => this.searchResults.set(items));
    }
    ngOnInit() {
        if (!this.auth.canViewRecipes()) {
            this.accessDenied.set(true);
        }
        else {
            this.loadRecipes();
        }
    }
    ngOnDestroy() { this.searchSubject.complete(); }
    async loadRecipes() {
        try {
            const data = await this.recipeService.getAllRecipes();
            this.recipes.set(data);
            this.accessDenied.set(false);
        }
        catch (e) {
            console.error("Error loading recipes:", e);
            if (e.code === 'permission-denied') {
                this.accessDenied.set(true);
                this.toast.show('Không có quyền truy cập Công thức.', 'error');
            }
            else {
                this.toast.show('Lỗi tải công thức: ' + e.message, 'error');
            }
        }
    }
    // --- Form & Search ---
    get ingredients() { return this.form.get('ingredients'); }
    addIngredient() {
        this.ingredients.push(this.fb.group({
            name: ['', Validators.required],
            _displayName: ['', Validators.required],
            amount: [0, Validators.required],
            unit: ['g', Validators.required]
        }));
    }
    onNameChange(e) {
        if (!this.isEditing()) {
            this.form.patchValue({ id: 'recipe_' + generateSlug(e.target.value) });
        }
    }
    onSearchInput(e, index) {
        this.activeSearchIndex = index;
        this.searchSubject.next(e.target.value);
    }
    onSearchFocus(index) {
        this.activeSearchIndex = index;
        const val = this.ingredients.at(index).get('_displayName')?.value;
        if (val)
            this.searchSubject.next(val);
    }
    selectItem(item, index) {
        this.ingredients.at(index).patchValue({
            name: item.id,
            _displayName: item.name,
            unit: item.unit
        });
        this.activeSearchIndex = null;
        this.searchResults.set([]);
    }
    // --- Actions ---
    openModal(recipe) {
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
        }
        else {
            this.isEditing.set(false);
            this.form.reset({ baseUnit: 'tube' });
            this.form.controls.id.enable();
            this.addIngredient();
        }
    }
    closeModal() { this.showModal.set(false); }
    async save() {
        if (!this.auth.canEditRecipes())
            return;
        if (this.form.invalid)
            return;
        const val = this.form.getRawValue();
        const recipe = {
            id: val.id,
            name: val.name,
            baseUnit: val.baseUnit,
            ingredients: val.ingredients.map(i => ({
                name: i.name, displayName: i._displayName, amount: i.amount, unit: i.unit
            }))
        };
        try {
            await this.recipeService.saveRecipe(recipe);
            this.toast.show('Đã lưu công thức!', 'success');
            this.closeModal();
            this.loadRecipes();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
    }
    async deleteRecipe(r) {
        if (!this.auth.canEditRecipes())
            return;
        if (await this.confirmation.confirm(`Xóa công thức "${r.name}"?`)) {
            await this.recipeService.deleteRecipe(r.id);
            this.loadRecipes();
            this.toast.show('Đã xóa');
        }
    }
    static { this.ɵfac = function RecipeManagerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RecipeManagerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RecipeManagerComponent, selectors: [["app-recipe-manager"]], decls: 6, vars: 3, consts: [[1, "flex", "flex-col", "flex-1", "min-h-0", "fade-in", "relative", "pb-10"], [1, "flex", "justify-end", "mb-4", "shrink-0"], [1, "bg-purple-600", "hover:bg-purple-700", "text-white", "px-4", "py-2", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "flex", "items-center", "gap-2", "active:scale-95", 3, "appLockPermission"], [1, "flex", "items-center", "justify-center", "h-64", "bg-red-50", "rounded-2xl", "border", "border-red-100"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "2xl:grid-cols-5", "gap-4", "overflow-y-auto", "custom-scrollbar", "p-1"], [1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "bg-purple-600", "hover:bg-purple-700", "text-white", "px-4", "py-2", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "flex", "items-center", "gap-2", "active:scale-95", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-plus"], [1, "text-center"], [1, "fa-solid", "fa-lock", "text-red-300", "text-4xl", "mb-3"], [1, "text-red-800", "font-bold", "text-lg"], [1, "text-red-600", "text-sm", "mt-1"], [1, "bg-white", "border", "border-slate-200", "rounded-2xl", "p-5", "hover:shadow-lg", "transition-all", "duration-300", "group", "relative", "hover:border-purple-300", "flex", "flex-col"], [1, "col-span-full", "py-20", "text-center", "text-slate-400", "italic", "bg-slate-50", "rounded-2xl", "border", "border-dashed", "border-slate-200"], [1, "flex", "justify-between", "items-start", "mb-3"], [1, "bg-purple-50", "text-purple-700", "px-2", "py-1", "rounded", "text-[10px]", "font-bold", "uppercase", "tracking-wider", "border", "border-purple-100"], [1, "flex", "gap-2", "opacity-0", "group-hover:opacity-100", "transition", "duration-200"], [1, "font-bold", "text-slate-800", "text-lg", "mb-4", "line-clamp-2", "leading-snug", 3, "title"], [1, "space-y-2", "border-t", "border-slate-50", "pt-3", "mt-auto"], [1, "flex", "justify-between", "text-xs", "items-center"], [1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-lg", "bg-white", "border", "border-slate-200", "text-blue-600", "hover:bg-blue-50", "hover:border-blue-300", "transition", "shadow-sm", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-pen", "text-[10px]"], [1, "w-7", "h-7", "flex", "items-center", "justify-center", "rounded-lg", "bg-white", "border", "border-slate-200", "text-red-500", "hover:bg-red-50", "hover:border-red-300", "transition", "shadow-sm", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-trash", "text-[10px]"], [1, "flex", "items-center", "gap-1.5", "overflow-hidden"], [1, "w-1.5", "h-1.5", "rounded-full", "bg-purple-200", "shrink-0"], [1, "text-slate-600", "font-medium", "truncate", 3, "title"], [1, "text-slate-700", "font-bold", "font-mono", "whitespace-nowrap"], [1, "text-[10px]", "font-normal", "text-slate-400"], [1, "fa-solid", "fa-flask", "text-3xl", "mb-3", "text-slate-300"], [1, "bg-white", "rounded-2xl", "shadow-2xl", "w-full", "max-w-2xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]", "animate-slide-up"], [1, "px-6", "py-4", "border-b", "border-slate-100", "bg-slate-50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-flask", "text-purple-600"], [1, "w-8", "h-8", "rounded-full", "bg-white", "border", "border-slate-200", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-y-auto", "p-6", "custom-scrollbar", "bg-white"], [1, "space-y-6", 3, "formGroup"], [1, "p-4", "bg-purple-50", "rounded-xl", "border", "border-purple-100", "space-y-4"], [1, "text-xs", "font-bold", "text-purple-800", "uppercase", "block", "mb-1.5"], [1, "text-red-500"], ["formControlName", "name", "placeholder", "VD: H\u1ED7n h\u1EE3p Mu\u1ED1i A", 1, "w-full", "border", "border-purple-200", "rounded-lg", "p-3", "text-sm", "font-bold", "outline-none", "focus:ring-2", "focus:ring-purple-500", "bg-white", "placeholder-purple-300", 3, "input"], [1, "grid", "grid-cols-2", "gap-4"], [1, "text-xs", "font-bold", "text-slate-500", "uppercase", "block", "mb-1"], ["formControlName", "id", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "bg-slate-100", "outline-none", "font-mono", "text-slate-600", 3, "readonly"], ["formControlName", "baseUnit", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-sm", "outline-none", "bg-white"], [3, "value"], [1, "flex", "justify-between", "items-center", "mb-3"], [1, "text-xs", "font-bold", "text-slate-700", "uppercase", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-layer-group", "text-slate-400"], ["type", "button", 1, "text-xs", "bg-slate-100", "text-slate-700", "border", "border-slate-200", "px-3", "py-1.5", "rounded-lg", "font-bold", "hover:bg-slate-200", "transition", 3, "click"], ["formArrayName", "ingredients", 1, "space-y-3"], [1, "flex", "gap-2", "items-center", "relative", "z-0", "p-2", "bg-slate-50", "rounded-xl", "border", "border-slate-100", "group", "transition", "hover:border-purple-200", "hover:bg-purple-50/50", 3, "formGroupName", "zIndex"], [1, "px-6", "py-4", "border-t", "border-slate-100", "bg-slate-50", "flex", "justify-end", "gap-3"], [1, "px-5", "py-2.5", "text-slate-600", "hover:bg-slate-200", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], [1, "px-6", "py-2.5", "bg-gradient-to-r", "from-purple-600", "to-indigo-600", "hover:from-purple-700", "hover:to-indigo-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "flex", "gap-2", "items-center", "relative", "z-0", "p-2", "bg-slate-50", "rounded-xl", "border", "border-slate-100", "group", "transition", "hover:border-purple-200", "hover:bg-purple-50/50", 3, "formGroupName"], [1, "w-6", "h-6", "rounded", "bg-slate-200", "text-slate-500", "flex", "items-center", "justify-center", "text-xs", "font-bold", "shrink-0"], [1, "flex-1", "relative"], ["formControlName", "_displayName", "placeholder", "Nh\u1EADp t\u00EAn h\u00F3a ch\u1EA5t...", 1, "w-full", "border", "border-slate-300", "rounded-lg", "px-3", "py-2", "text-xs", "font-bold", "text-slate-700", "outline-none", "focus:border-purple-500", "bg-white", "shadow-sm", 3, "input", "focus"], ["formControlName", "name", "type", "hidden"], [1, "absolute", "top-full", "left-0", "w-full", "bg-white", "border", "border-slate-200", "rounded-lg", "shadow-xl", "mt-1", "max-h-48", "overflow-y-auto", "z-50", "custom-scrollbar"], ["formControlName", "amount", "type", "number", "placeholder", "L\u01B0\u1EE3ng", 1, "w-20", "border", "border-slate-300", "rounded-lg", "px-2", "py-2", "text-xs", "text-center", "font-bold", "outline-none", "focus:border-purple-500"], ["formControlName", "unit", 1, "w-20", "border", "border-slate-300", "rounded-lg", "px-2", "py-2", "text-xs", "outline-none", "bg-white"], ["type", "button", 1, "w-8", "h-8", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "hover:bg-red-50", "rounded-full", "transition", 3, "click"], [1, "px-3", "py-2", "hover:bg-purple-50", "cursor-pointer", "border-b", "border-slate-50", "last:border-0", "flex", "justify-between", "items-center", "group/item"], [1, "px-3", "py-2", "hover:bg-purple-50", "cursor-pointer", "border-b", "border-slate-50", "last:border-0", "flex", "justify-between", "items-center", "group/item", 3, "click"], [1, "truncate", "pr-2"], [1, "text-xs", "font-bold", "text-slate-700", "group-hover/item:text-purple-700", "truncate"], [1, "text-[10px]", "text-slate-400", "font-mono"], [1, "text-[9px]", "font-bold", "text-slate-500", "bg-slate-100", "px-1.5", "py-0.5", "rounded", "shrink-0"]], template: function RecipeManagerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵtemplate(2, RecipeManagerComponent_Conditional_2_Template, 3, 1, "button", 2);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(3, RecipeManagerComponent_Conditional_3_Template, 7, 0, "div", 3)(4, RecipeManagerComponent_Conditional_4_Template, 4, 1, "div", 4)(5, RecipeManagerComponent_Conditional_5_Template, 43, 4, "div", 5);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.auth.canEditRecipes() || ctx.state.showLockedFeatures() ? 2 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.accessDenied() ? 3 : 4);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showModal() ? 5 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, ReactiveFormsModule, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i1.FormArrayName, LockPermissionDirective], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RecipeManagerComponent, [{
        type: Component,
        args: [{
                selector: 'app-recipe-manager',
                standalone: true,
                imports: [CommonModule, FormsModule, ReactiveFormsModule, LockPermissionDirective],
                template: `
    <div class="flex flex-col flex-1 min-h-0 fade-in relative pb-10">
        
        <!-- Header Actions (No title, title is in tabs) -->
        <div class="flex justify-end mb-4 shrink-0">
            @if(auth.canEditRecipes() || state.showLockedFeatures()) {
                <button [appLockPermission]="'recipe_edit'" (click)="openModal()" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95">
                    <i class="fa-solid fa-plus"></i> Tạo Công Thức
                </button>
            }
        </div>

        @if(accessDenied()) {
            <div class="flex items-center justify-center h-64 bg-red-50 rounded-2xl border border-red-100">
                <div class="text-center">
                    <i class="fa-solid fa-lock text-red-300 text-4xl mb-3"></i>
                    <h3 class="text-red-800 font-bold text-lg">Không Có Quyền Truy Cập</h3>
                    <p class="text-red-600 text-sm mt-1">Bạn không có quyền xem thư viện công thức.</p>
                </div>
            </div>
        } @else {
            <!-- List -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar p-1">
                @for (recipe of recipes(); track recipe.id) {
                    <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group relative hover:border-purple-300 flex flex-col">
                        <div class="flex justify-between items-start mb-3">
                            <span class="bg-purple-50 text-purple-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-purple-100">
                                {{recipe.baseUnit}}
                            </span>
                            @if(auth.canEditRecipes() || state.showLockedFeatures()) {
                                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                    <button [appLockPermission]="'recipe_edit'" (click)="openModal(recipe)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition shadow-sm">
                                        <i class="fa-solid fa-pen text-[10px]"></i>
                                    </button>
                                    <button [appLockPermission]="'recipe_edit'" (click)="deleteRecipe(recipe)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition shadow-sm">
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
                        <p>Chưa có công thức nào. Nhấn "Tạo công thức" để thêm mới.</p>
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
                            {{ isEditing() ? 'Cập nhật công thức' : 'Tạo công thức Mới' }}
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
                                        <i class="fa-solid fa-layer-group text-slate-400"></i> Thành phần (từ kho)
                                    </label>
                                    <button type="button" (click)="addIngredient()" class="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 transition">+ Thêm Dòng</button>
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
                        <button (click)="closeModal()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Hủy Bỏ</button>
                        <button (click)="save()" [disabled]="form.invalid" class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50">Lưu Công Thức</button>
                    </div>
                </div>
            </div>
        }
    </div>
  `
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RecipeManagerComponent, { className: "RecipeManagerComponent", filePath: "src/app/features/recipes/recipe-manager.component.ts", lineNumber: 182 }); })();
//# sourceMappingURL=recipe-manager.component.js.map