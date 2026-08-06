import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { InventoryService } from './inventory.service';
import { CalculatorService } from '../../core/services/calculator.service';
import { RecipeService } from '../recipes/recipe.service'; // Import Service
import { formatNum, UNIT_OPTIONS, generateSlug, formatSmartUnit, parseQuantityInput } from '../../shared/utils/utils';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { AuthService } from '../../core/services/auth.service';
import { LabelPrintComponent } from '../labels/label-print.component';
import { PubchemService, GHS_DICTIONARY } from '../../core/services/pubchem.service';
import { HasPermissionDirective } from '../../shared/directives/has-permission.directive';
import { LockPermissionDirective } from '../../shared/directives/lock-permission.directive';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const InventoryComponent_Conditional_26_Defer_1_DepsFn = () => [i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.RequiredValidator, i1.FormGroupDirective, i1.FormControlName];
const _c0 = () => [1, 2, 3, 4];
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.name;
const _forTrack2 = ($index, $item) => $item.value;
function InventoryComponent_Conditional_10_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-skeleton", 25);
} }
function InventoryComponent_Conditional_10_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h5", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.totalCount());
} }
function InventoryComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9)(1, "div", 21)(2, "div", 22);
    i0.ɵɵelement(3, "i", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "p", 24);
    i0.ɵɵtext(6, "T\u1ED5ng s\u1ED1 h\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(7, InventoryComponent_Conditional_10_Conditional_7_Template, 1, 0, "app-skeleton", 25)(8, InventoryComponent_Conditional_10_Conditional_8_Template, 2, 1, "h5", 26);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵconditional(ctx_r0.totalCount() === null ? 7 : 8);
} }
function InventoryComponent_Conditional_21_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cat_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", cat_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(cat_r3.name);
} }
function InventoryComponent_Conditional_21_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16)(1, "div", 27);
    i0.ɵɵelement(2, "i", 28);
    i0.ɵɵelementStart(3, "input", 29);
    i0.ɵɵlistener("ngModelChange", function InventoryComponent_Conditional_21_Template_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onSearchInput($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 30)(5, "select", 31);
    i0.ɵɵlistener("ngModelChange", function InventoryComponent_Conditional_21_Template_select_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onFilterChange($event)); });
    i0.ɵɵelementStart(6, "option", 32);
    i0.ɵɵtext(7, "T\u1EA5t c\u1EA3");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(8, InventoryComponent_Conditional_21_For_9_Template, 2, 2, "option", 33, _forTrack0);
    i0.ɵɵelementStart(10, "option", 34);
    i0.ɵɵtext(11, "S\u1EAFp h\u1EBFt");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(12, "button", 35);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_21_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.openModal()); });
    i0.ɵɵelement(13, "i", 36);
    i0.ɵɵtext(14, " Th\u00EAm ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngModel", ctx_r0.searchTerm());
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngModel", ctx_r0.filterType());
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.state.categories());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("appLockPermission", "inventory_edit");
} }
function InventoryComponent_Conditional_22_Conditional_2_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 48)(1, "div", 4);
    i0.ɵɵelement(2, "app-skeleton", 49);
    i0.ɵɵelementStart(3, "div", 50);
    i0.ɵɵelement(4, "app-skeleton", 51)(5, "app-skeleton", 52);
    i0.ɵɵelementEnd()()();
} }
function InventoryComponent_Conditional_22_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, InventoryComponent_Conditional_22_Conditional_2_For_1_Template, 6, 0, "div", 48, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c0));
} }
function InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_10_For_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 75);
} if (rf & 2) {
    const ghs_r6 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(5);
    i0.ɵɵproperty("src", ctx_r0.GHS_DICT[ghs_r6].iconUrl, i0.ɵɵsanitizeUrl)("title", ctx_r0.GHS_DICT[ghs_r6].label);
} }
function InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_10_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_10_For_2_Conditional_0_Template, 1, 2, "img", 75);
} if (rf & 2) {
    const ghs_r6 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(5);
    i0.ɵɵconditional(ctx_r0.GHS_DICT[ghs_r6] ? 0 : -1);
} }
function InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 62);
    i0.ɵɵrepeaterCreate(1, InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_10_For_2_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r5 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(item_r5.ghsWarnings);
} }
function InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 63);
} }
function InventoryComponent_Conditional_22_Conditional_3_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 56);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_Conditional_3_For_1_Template_div_click_0_listener() { const item_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.openModal(item_r5)); });
    i0.ɵɵelementStart(1, "div", 57)(2, "div", 4)(3, "div", 58);
    i0.ɵɵelement(4, "i", 59);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div")(6, "h6", 60);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 61);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_10_Template, 3, 0, "div", 62);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(11, InventoryComponent_Conditional_22_Conditional_3_For_1_Conditional_11_Template, 1, 0, "i", 63);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 64)(13, "div", 65)(14, "div")(15, "div", 66);
    i0.ɵɵtext(16, "T\u1ED3n kho");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "div", 67);
    i0.ɵɵtext(18);
    i0.ɵɵelementStart(19, "span", 68);
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(21, "div", 16)(22, "span", 69);
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(24, "div", 70);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_Conditional_3_For_1_Template_div_click_24_listener($event) { i0.ɵɵrestoreView(_r4); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(25, "div", 71)(26, "input", 72, 0);
    i0.ɵɵlistener("keyup.enter", function InventoryComponent_Conditional_22_Conditional_3_For_1_Template_input_keyup_enter_26_listener() { const item_r5 = i0.ɵɵrestoreView(_r4).$implicit; const quickInputMobile_r7 = i0.ɵɵreference(27); const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.quickUpdate(item_r5, quickInputMobile_r7.value); return i0.ɵɵresetView(quickInputMobile_r7.value = ""); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "button", 73);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_Conditional_3_For_1_Template_button_click_28_listener() { const item_r5 = i0.ɵɵrestoreView(_r4).$implicit; const quickInputMobile_r7 = i0.ɵɵreference(27); const ctx_r0 = i0.ɵɵnextContext(3); ctx_r0.quickUpdate(item_r5, quickInputMobile_r7.value); return i0.ɵɵresetView(quickInputMobile_r7.value = ""); });
    i0.ɵɵelement(29, "i", 74);
    i0.ɵɵtext(30, " Nhanh");
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const item_r5 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r0.getIconGradient(item_r5));
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.getIcon(item_r5.category));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r5.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r5.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.ghsWarnings && item_r5.ghsWarnings.length > 0 ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r5.stock <= (item_r5.threshold || 5) ? 11 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵclassProp("text-red-500", item_r5.stock <= 0)("dark:text-red-400", item_r5.stock <= 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.formatNum(item_r5.stock), " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r5.unit);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.state.categoriesMap().get(item_r5.category || "") || item_r5.category);
    i0.ɵɵadvance();
    i0.ɵɵproperty("appLockPermission", "inventory_edit");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing())("placeholder", "+/- (" + item_r5.unit + ")");
} }
function InventoryComponent_Conditional_22_Conditional_3_ForEmpty_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 54);
    i0.ɵɵtext(1, "Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u.");
    i0.ɵɵelementEnd();
} }
function InventoryComponent_Conditional_22_Conditional_3_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 76);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_Conditional_3_Conditional_3_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.loadMore()); });
    i0.ɵɵtext(1, "Xem Th\u00EAm...");
    i0.ɵɵelementEnd();
} }
function InventoryComponent_Conditional_22_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, InventoryComponent_Conditional_22_Conditional_3_For_1_Template, 31, 18, "div", 53, _forTrack0, false, InventoryComponent_Conditional_22_Conditional_3_ForEmpty_2_Template, 2, 0, "div", 54);
    i0.ɵɵtemplate(3, InventoryComponent_Conditional_22_Conditional_3_Conditional_3_Template, 2, 0, "button", 55);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r0.items());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.hasMore() ? 3 : -1);
} }
function InventoryComponent_Conditional_22_th_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 43);
    i0.ɵɵtext(1, "Nh\u1EADp nhanh");
    i0.ɵɵelementEnd();
} }
function InventoryComponent_Conditional_22_For_19_Conditional_11_For_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 99);
} if (rf & 2) {
    const ghs_r11 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵproperty("src", ctx_r0.GHS_DICT[ghs_r11].iconUrl, i0.ɵɵsanitizeUrl)("title", ctx_r0.GHS_DICT[ghs_r11].label);
} }
function InventoryComponent_Conditional_22_For_19_Conditional_11_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, InventoryComponent_Conditional_22_For_19_Conditional_11_For_2_Conditional_0_Template, 1, 2, "img", 99);
} if (rf & 2) {
    const ghs_r11 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵconditional(ctx_r0.GHS_DICT[ghs_r11] ? 0 : -1);
} }
function InventoryComponent_Conditional_22_For_19_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 85);
    i0.ɵɵrepeaterCreate(1, InventoryComponent_Conditional_22_For_19_Conditional_11_For_2_Template, 1, 1, null, null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r10 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵrepeater(item_r10.ghsWarnings);
} }
function InventoryComponent_Conditional_22_For_19_td_24_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 100);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_For_19_td_24_Template_td_click_0_listener($event) { i0.ɵɵrestoreView(_r12); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "div", 101)(2, "input", 102, 1);
    i0.ɵɵlistener("keyup.enter", function InventoryComponent_Conditional_22_For_19_td_24_Template_input_keyup_enter_2_listener() { i0.ɵɵrestoreView(_r12); const quickInput_r13 = i0.ɵɵreference(3); const item_r10 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(2); ctx_r0.quickUpdate(item_r10, quickInput_r13.value); return i0.ɵɵresetView(quickInput_r13.value = ""); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 103);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_For_19_td_24_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r12); const quickInput_r13 = i0.ɵɵreference(3); const item_r10 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(2); ctx_r0.quickUpdate(item_r10, quickInput_r13.value); return i0.ɵɵresetView(quickInput_r13.value = ""); });
    i0.ɵɵelement(5, "i", 104);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r10 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing())("placeholder", "+/- (" + item_r10.unit + ")");
} }
function InventoryComponent_Conditional_22_For_19_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 77);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_For_19_Template_tr_click_0_listener() { const item_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openModal(item_r10)); });
    i0.ɵɵelementStart(1, "td", 78)(2, "div", 4)(3, "div", 79);
    i0.ɵɵelement(4, "i", 80);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 81)(6, "h6", 82);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 83)(9, "span", 84);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, InventoryComponent_Conditional_22_For_19_Conditional_11_Template, 3, 0, "div", 85);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(12, "td", 86)(13, "span", 87);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "td", 88)(16, "span", 89);
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "td", 90)(19, "div", 91);
    i0.ɵɵelement(20, "span", 92);
    i0.ɵɵdeclareLet(21);
    i0.ɵɵelementStart(22, "div", 93);
    i0.ɵɵelement(23, "div", 94);
    i0.ɵɵelementEnd()()();
    i0.ɵɵtemplate(24, InventoryComponent_Conditional_22_For_19_td_24_Template, 6, 2, "td", 95);
    i0.ɵɵelementStart(25, "td", 96)(26, "button", 97);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_22_For_19_Template_button_click_26_listener() { const item_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.openModal(item_r10)); });
    i0.ɵɵelement(27, "i", 98);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r10 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵclassMap(ctx_r0.getIconGradient(item_r10));
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.getIcon(item_r10.category));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r10.name || item_r10.id);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r10.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r10.ghsWarnings && item_r10.ghsWarnings.length > 0 ? 11 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.state.categoriesMap().get(item_r10.category || "") || item_r10.category);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r10.unit);
    i0.ɵɵadvance(3);
    i0.ɵɵclassProp("text-red-600", item_r10.stock <= 0)("dark:text-red-400", item_r10.stock <= 0);
    i0.ɵɵproperty("innerHTML", ctx_r0.formatSmartUnit(item_r10.stock, item_r10.unit), i0.ɵɵsanitizeHtml);
    const percent_r14 = ctx_r0.getStockPercent(item_r10);
    i0.ɵɵadvance(3);
    i0.ɵɵstyleProp("width", percent_r14, "%");
    i0.ɵɵclassProp("bg-emerald-500", percent_r14 > 40)("bg-orange-500", percent_r14 <= 40 && percent_r14 > 10)("bg-red-500", percent_r14 <= 10);
    i0.ɵɵadvance();
    i0.ɵɵproperty("appHasPermission", "inventory_edit");
} }
function InventoryComponent_Conditional_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 17)(1, "div", 37);
    i0.ɵɵtemplate(2, InventoryComponent_Conditional_22_Conditional_2_Template, 2, 1)(3, InventoryComponent_Conditional_22_Conditional_3_Template, 4, 2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "table", 38)(5, "thead", 39)(6, "tr")(7, "th", 40);
    i0.ɵɵtext(8, "H\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "th", 41);
    i0.ɵɵtext(10, "Ph\u00E2n lo\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "th", 42);
    i0.ɵɵtext(12, "\u0110VT (G\u1ED1c)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "th", 43);
    i0.ɵɵtext(14, "T\u1ED3n kho (Gauge)");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(15, InventoryComponent_Conditional_22_th_15_Template, 2, 0, "th", 44);
    i0.ɵɵelement(16, "th", 45);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(17, "tbody", 46);
    i0.ɵɵrepeaterCreate(18, InventoryComponent_Conditional_22_For_19_Template, 28, 23, "tr", 47, _forTrack0);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.isInitialLoading() ? 2 : 3);
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("appHasPermission", "inventory_edit");
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.items());
} }
function InventoryComponent_Conditional_23_For_5_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 111);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_23_For_5_Template_div_click_0_listener() { const sop_r16 = i0.ɵɵrestoreView(_r15).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.selectedSopForCap.set(sop_r16)); });
    i0.ɵɵelementStart(1, "div")(2, "div", 112);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 113);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_11_0;
    const sop_r16 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(((tmp_11_0 = ctx_r0.selectedSopForCap()) == null ? null : tmp_11_0.id) === sop_r16.id ? "bg-white dark:bg-slate-800 shadow-sm dark:shadow-none border-fuchsia-200 dark:border-fuchsia-500/30 ring-1 ring-fuchsia-100 dark:ring-fuchsia-500/20" : "border-transparent");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r0.state.categoriesMap().get(sop_r16.category || "") || sop_r16.category);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(sop_r16.name);
} }
function InventoryComponent_Conditional_23_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 109);
    i0.ɵɵelement(1, "i", 114);
    i0.ɵɵelementStart(2, "span", 115);
    i0.ɵɵtext(3, "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u kho...");
    i0.ɵɵelementEnd()();
} }
function InventoryComponent_Conditional_23_Conditional_8_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 123);
    i0.ɵɵelement(1, "i", 132);
    i0.ɵɵelementStart(2, "div")(3, "div", 133);
    i0.ɵɵtext(4, "Bottleneck");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 134);
    i0.ɵɵtext(6, "Gi\u1EDBi h\u1EA1n b\u1EDFi ");
    i0.ɵɵelementStart(7, "b", 135);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, ".");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(8);
    i0.ɵɵtextInterpolate(ctx_r0.resolveCapacityName(((tmp_4_0 = ctx_r0.capacityResult()) == null ? null : tmp_4_0.limitingFactor) || ""));
} }
function InventoryComponent_Conditional_23_Conditional_8_For_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 131)(1, "td", 136);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 137);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 137);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 138);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_16_0;
    let tmp_17_0;
    const row_r18 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.resolveCapacityName(row_r18.name));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.formatNum(row_r18.stock));
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.formatNum(row_r18.need));
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-red-500", row_r18.batches === ((tmp_16_0 = (tmp_16_0 = ctx_r0.capacityResult()) == null ? null : tmp_16_0.maxBatches) !== null && tmp_16_0 !== undefined ? tmp_16_0 : 0))("dark:text-red-400", row_r18.batches === ((tmp_17_0 = (tmp_17_0 = ctx_r0.capacityResult()) == null ? null : tmp_17_0.maxBatches) !== null && tmp_17_0 !== undefined ? tmp_17_0 : 0));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.formatNum(row_r18.batches));
} }
function InventoryComponent_Conditional_23_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 116)(1, "div")(2, "h4", 117);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 118)(5, "button", 119);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_23_Conditional_8_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r17); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.capacityMode.set("marginal")); });
    i0.ɵɵtext(6, "M\u1ED9t M\u1EABu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 119);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_23_Conditional_8_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r17); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.capacityMode.set("standard")); });
    i0.ɵɵtext(8, "M\u1EBB Ti\u00EAu Chu\u1EA9n");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(9, "div", 120)(10, "div", 66);
    i0.ɵɵtext(11, "N\u0103ng l\u1EF1c t\u1ED1i \u0111a");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 121);
    i0.ɵɵtext(13);
    i0.ɵɵelementStart(14, "span", 122);
    i0.ɵɵtext(15, "m\u1EBB");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵtemplate(16, InventoryComponent_Conditional_23_Conditional_8_Conditional_16_Template, 10, 1, "div", 123);
    i0.ɵɵelementStart(17, "div", 124)(18, "table", 125)(19, "thead", 126)(20, "tr")(21, "th", 127);
    i0.ɵɵtext(22, "H\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "th", 128);
    i0.ɵɵtext(24, "T\u1ED3n kho");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "th", 128);
    i0.ɵɵtext(26, "C\u1EA7n / M\u1EBB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "th", 129);
    i0.ɵɵtext(28, "M\u1EBB");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "tbody", 130);
    i0.ɵɵrepeaterCreate(30, InventoryComponent_Conditional_23_Conditional_8_For_31_Template, 9, 8, "tr", 131, _forTrack1);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx.name);
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r0.capacityMode() === "marginal" ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/50" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400");
    i0.ɵɵadvance(2);
    i0.ɵɵclassMap(ctx_r0.capacityMode() === "standard" ? "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/50" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400");
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate1("", ((tmp_6_0 = ctx_r0.capacityResult()) == null ? null : tmp_6_0.maxBatches) || 0, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(((tmp_7_0 = ctx_r0.capacityResult()) == null ? null : tmp_7_0.limitingFactor) ? 16 : -1);
    i0.ɵɵadvance(14);
    i0.ɵɵrepeater((tmp_8_0 = ctx_r0.capacityResult()) == null ? null : tmp_8_0.details);
} }
function InventoryComponent_Conditional_23_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 110);
    i0.ɵɵelement(1, "i", 139);
    i0.ɵɵelementStart(2, "span", 140);
    i0.ɵɵtext(3, "Ch\u1ECDn quy tr\u00ECnh");
    i0.ɵɵelementEnd()();
} }
function InventoryComponent_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18)(1, "div", 105)(2, "h6", 106);
    i0.ɵɵtext(3, "Ch\u1ECDn Quy Tr\u00ECnh");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(4, InventoryComponent_Conditional_23_For_5_Template, 6, 4, "div", 107, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 108);
    i0.ɵɵtemplate(7, InventoryComponent_Conditional_23_Conditional_7_Template, 4, 0, "div", 109)(8, InventoryComponent_Conditional_23_Conditional_8_Template, 32, 7)(9, InventoryComponent_Conditional_23_Conditional_9_Template, 4, 0, "div", 110);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r0.state.sops());
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.capacityLoading() ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_3_0 = ctx_r0.selectedSopForCap()) ? 8 : 9, tmp_3_0);
} }
function InventoryComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19);
    i0.ɵɵelement(1, "app-label-print", 141);
    i0.ɵɵelementEnd();
} }
function InventoryComponent_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 142);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_25_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r19); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.openModal()); });
    i0.ɵɵelement(1, "i", 143);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("appLockPermission", "inventory_edit");
} }
function InventoryComponent_Conditional_26_Defer_0_For_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const cat_r21 = ctx.$implicit;
    i0.ɵɵproperty("value", cat_r21.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", cat_r21.name, " (", cat_r21.id, ")");
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 186);
    i0.ɵɵtext(1, " Tra c\u1EE9u... ");
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 187);
    i0.ɵɵtext(1, " T\u1EF1 \u0111\u1ED9ng tra GHS ");
} }
function InventoryComponent_Conditional_26_Defer_0_For_48_Template(rf, ctx) { if (rf & 1) {
    const _r22 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 188);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_26_Defer_0_For_48_Template_div_click_0_listener() { const code_r23 = i0.ɵɵrestoreView(_r22).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.toggleGhs(code_r23)); });
    i0.ɵɵelement(1, "img", 189);
    i0.ɵɵelementStart(2, "span", 190);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_12_0;
    const code_r23 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassMap(((tmp_12_0 = ctx_r0.form.get("ghsWarnings")) == null ? null : tmp_12_0.value == null ? null : tmp_12_0.value.includes(code_r23)) ? "!border-red-500 ring-1 ring-red-200 dark:ring-red-900/50 !opacity-100 shadow-sm bg-red-50 dark:bg-red-900/20" : "border-slate-200 dark:border-slate-700");
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r0.GHS_DICT[code_r23].iconUrl, i0.ɵɵsanitizeUrl)("alt", code_r23);
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", ctx_r0.GHS_DICT[code_r23].label);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.GHS_DICT[code_r23].label);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_1_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const h_r24 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(h_r24);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "strong", 192);
    i0.ɵɵtext(2, "C\u1EA3nh b\u00E1o Nguy hi\u1EC3m (H):");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 193);
    i0.ɵɵrepeaterCreate(4, InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_1_For_5_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater((tmp_4_0 = ctx_r0.form.get("hazardStatements")) == null ? null : tmp_4_0.value);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_2_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r25 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(p_r25);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 191)(1, "strong");
    i0.ɵɵtext(2, "Ph\u00F2ng ng\u1EEBa (P):");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 193);
    i0.ɵɵrepeaterCreate(4, InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_2_For_5_Template, 2, 1, "li", null, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater((tmp_4_0 = ctx_r0.form.get("precautionaryStatements")) == null ? null : tmp_4_0.value);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 168);
    i0.ɵɵtemplate(1, InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_1_Template, 6, 0, "div")(2, InventoryComponent_Conditional_26_Defer_0_Conditional_49_Conditional_2_Template, 6, 0, "div", 191);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_3_0 = ctx_r0.form.get("hazardStatements")) == null ? null : tmp_3_0.value == null ? null : tmp_3_0.value.length) ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(((tmp_4_0 = ctx_r0.form.get("precautionaryStatements")) == null ? null : tmp_4_0.value == null ? null : tmp_4_0.value.length) ? 2 : -1);
} }
function InventoryComponent_Conditional_26_Defer_0_For_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const opt_r26 = ctx.$implicit;
    i0.ɵɵproperty("value", opt_r26.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(opt_r26.label);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_90_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 186);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_90_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " X\u00F3a ");
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_90_Template(rf, ctx) { if (rf & 1) {
    const _r27 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 194);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_26_Defer_0_Conditional_90_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r27); const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.deleteItem(ctx_r0.form.getRawValue())); });
    i0.ɵɵtemplate(1, InventoryComponent_Conditional_26_Defer_0_Conditional_90_Conditional_1_Template, 1, 0, "i", 186)(2, InventoryComponent_Conditional_26_Defer_0_Conditional_90_Conditional_2_Template, 1, 0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isProcessing() ? 1 : 2);
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_92_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 186);
    i0.ɵɵtext(1, " \u0110ang l\u01B0u... ");
} }
function InventoryComponent_Conditional_26_Defer_0_Conditional_93_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.isEditing() ? "L\u01B0u thay \u0111\u1ED5i" : "T\u1EA1o m\u1EDBi", " ");
} }
function InventoryComponent_Conditional_26_Defer_0_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 144);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_26_Defer_0_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.closeModal()); });
    i0.ɵɵelementStart(1, "div", 145);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_26_Defer_0_Template_div_click_1_listener($event) { i0.ɵɵrestoreView(_r20); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(2, "div", 146)(3, "div")(4, "h5", 147);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 148);
    i0.ɵɵtext(7, "Th\u00F4ng tin chi ti\u1EBFt h\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "button", 149);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_26_Defer_0_Template_button_click_8_listener() { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.closeModal()); });
    i0.ɵɵelement(9, "i", 150);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 151)(11, "form", 152);
    i0.ɵɵlistener("ngSubmit", function InventoryComponent_Conditional_26_Defer_0_Template_form_ngSubmit_11_listener() { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.save()); });
    i0.ɵɵelementStart(12, "div")(13, "label", 153);
    i0.ɵɵtext(14, "T\u00EAn h\u00F3a ch\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "input", 154);
    i0.ɵɵlistener("input", function InventoryComponent_Conditional_26_Defer_0_Template_input_input_15_listener($event) { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.onNameChange($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 155)(17, "div")(18, "label", 153);
    i0.ɵɵtext(19, "M\u00E3 \u0111\u1ECBnh danh");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(20, "input", 156);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(21, "div")(22, "label", 153);
    i0.ɵɵtext(23, "Ph\u00E2n lo\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "select", 157)(25, "option", 158);
    i0.ɵɵtext(26, "Ch\u1ECDn ph\u00E2n lo\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵrepeaterCreate(27, InventoryComponent_Conditional_26_Defer_0_For_28_Template, 2, 3, "option", 33, _forTrack0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(29, "div", 155)(30, "div")(31, "label", 153);
    i0.ɵɵtext(32, "T\u00EAn ti\u1EBFng Anh");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(33, "input", 159);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "div")(35, "label", 153);
    i0.ɵɵtext(36, "S\u1ED1 CAS");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(37, "input", 160);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(38, "div", 161)(39, "div", 162)(40, "label", 163);
    i0.ɵɵelement(41, "i", 164);
    i0.ɵɵtext(42, " C\u1EA3nh b\u00E1o H\u00F3a h\u1ECDc ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "button", 165);
    i0.ɵɵlistener("click", function InventoryComponent_Conditional_26_Defer_0_Template_button_click_43_listener() { i0.ɵɵrestoreView(_r20); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.fetchPubChem()); });
    i0.ɵɵtemplate(44, InventoryComponent_Conditional_26_Defer_0_Conditional_44_Template, 2, 0)(45, InventoryComponent_Conditional_26_Defer_0_Conditional_45_Template, 2, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "div", 166);
    i0.ɵɵrepeaterCreate(47, InventoryComponent_Conditional_26_Defer_0_For_48_Template, 4, 6, "div", 167, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(49, InventoryComponent_Conditional_26_Defer_0_Conditional_49_Template, 3, 2, "div", 168);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "div", 169)(51, "div")(52, "label", 153);
    i0.ɵɵtext(53, "T\u1ED3n kho");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(54, "input", 170);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(55, "div")(56, "label", 153);
    i0.ɵɵtext(57, "\u0110\u01A1n v\u1ECB (G\u1ED1c)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(58, "select", 171);
    i0.ɵɵrepeaterCreate(59, InventoryComponent_Conditional_26_Defer_0_For_60_Template, 2, 2, "option", 33, _forTrack2);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(61, "div", 155)(62, "div")(63, "label", 153);
    i0.ɵɵtext(64, "V\u1ECB tr\u00ED");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(65, "input", 172);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "div")(67, "label", 153);
    i0.ɵɵtext(68, "Ng\u01B0\u1EE1ng b\u00E1o \u0111\u1ED9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(69, "input", 173);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(70, "div", 174)(71, "div")(72, "label", 175);
    i0.ɵɵtext(73, "GTIN (m\u00E3 s\u1EA3n ph\u1EA9m)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(74, "input", 176);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(75, "div")(76, "label", 175);
    i0.ɵɵtext(77, "S\u1ED1 L\u00F4 (Lot/Batch)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(78, "input", 177);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(79, "div")(80, "label", 175);
    i0.ɵɵtext(81, "H\u1EA1n s\u1EED d\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(82, "input", 178);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(83, "div", 179)(84, "label", 180);
    i0.ɵɵtext(85, "L\u00FD do thay \u0111\u1ED5i ");
    i0.ɵɵelementStart(86, "span", 181);
    i0.ɵɵtext(87, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(88, "input", 182);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(89, "div", 183);
    i0.ɵɵtemplate(90, InventoryComponent_Conditional_26_Defer_0_Conditional_90_Template, 3, 2, "button", 184);
    i0.ɵɵelementStart(91, "button", 185);
    i0.ɵɵtemplate(92, InventoryComponent_Conditional_26_Defer_0_Conditional_92_Template, 2, 0)(93, InventoryComponent_Conditional_26_Defer_0_Conditional_93_Template, 1, 1);
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    let tmp_9_0;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.isEditing() ? "C\u1EADp nh\u1EADt" : "Th\u00EAm m\u1EDBi");
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("formGroup", ctx_r0.form);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("readonly", ctx_r0.isEditing());
    i0.ɵɵadvance(7);
    i0.ɵɵrepeater(ctx_r0.state.categories());
    i0.ɵɵadvance(16);
    i0.ɵɵproperty("disabled", ctx_r0.isFetchingGhs());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isFetchingGhs() ? 44 : 45);
    i0.ɵɵadvance(3);
    i0.ɵɵrepeater(ctx_r0.ghsKeys);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(((tmp_9_0 = ctx_r0.form.get("hazardStatements")) == null ? null : tmp_9_0.value == null ? null : tmp_9_0.value.length) || ((tmp_9_0 = ctx_r0.form.get("precautionaryStatements")) == null ? null : tmp_9_0.value == null ? null : tmp_9_0.value.length) ? 49 : -1);
    i0.ɵɵadvance(10);
    i0.ɵɵrepeater(ctx_r0.unitOptions);
    i0.ɵɵadvance(31);
    i0.ɵɵconditional(ctx_r0.isEditing() ? 90 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r0.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.isProcessing() ? 92 : 93);
} }
function InventoryComponent_Conditional_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, InventoryComponent_Conditional_26_Defer_0_Template, 94, 9);
    i0.ɵɵdefer(1, 0, InventoryComponent_Conditional_26_Defer_1_DepsFn);
    i0.ɵɵdeferOnIdle();
} }
export class InventoryComponent {
    get GHS_DICT() { return GHS_DICTIONARY; }
    get ghsKeys() { return Object.keys(GHS_DICTIONARY); }
    constructor() {
        this.state = inject(StateService);
        this.inventoryService = inject(InventoryService);
        this.recipeService = inject(RecipeService); // Inject RecipeService
        this.auth = inject(AuthService);
        this.pubchem = inject(PubchemService);
        this.toast = inject(ToastService);
        this.calcService = inject(CalculatorService);
        this.confirmationService = inject(ConfirmationService);
        this.route = inject(ActivatedRoute);
        this.fb = inject(FormBuilder);
        // Added 'labels' to type definition
        this.activeTab = signal('list');
        // Data & Pagination (Client-side filtering for instant UX)
        this.allItems = this.state.inventory;
        this.displayLimit = signal(20);
        this.isInitialLoading = computed(() => this.allItems().length === 0);
        this.isProcessing = signal(false);
        this.filteredItems = computed(() => {
            let items = this.allItems();
            const term = this.searchTerm().toLowerCase().trim();
            const filter = this.filterType();
            // 1. Lọc theo Phân loại
            if (filter !== 'all') {
                if (filter === 'low') {
                    items = items.filter(i => i.stock <= (i.threshold || 5));
                }
                else {
                    items = items.filter(i => i.category === filter);
                }
            }
            // 2. Lọc theo Từ khóa (Tìm trên cả Tên và ID, bỏ qua dấu tiếng Việt)
            if (term) {
                const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const normalizedTerm = removeAccents(term);
                items = items.filter(i => {
                    const nameMatch = i.name ? removeAccents(i.name.toLowerCase()).includes(normalizedTerm) : false;
                    const idMatch = i.id ? removeAccents(i.id.toLowerCase()).includes(normalizedTerm) : false;
                    return nameMatch || idMatch;
                });
            }
            // 3. Sắp xếp mới nhất lên đầu
            return [...items].sort((a, b) => {
                const timeA = a.lastUpdated?.seconds || 0;
                const timeB = b.lastUpdated?.seconds || 0;
                return timeB - timeA;
            });
        });
        this.items = computed(() => this.filteredItems().slice(0, this.displayLimit()));
        this.hasMore = computed(() => this.displayLimit() < this.filteredItems().length);
        this.totalCount = computed(() => this.allItems().length);
        // Filters
        this.searchTerm = signal('');
        this.filterType = signal('all');
        this.searchSubject = new Subject();
        this.selectedIds = signal(new Set());
        // Capacity - Local Inventory Snapshot
        this.capacityInventoryMap = signal({});
        this.capacityRecipeMap = signal({}); // New Signal for Recipes
        this.capacityLoading = signal(false);
        this.selectedSopForCap = signal(null);
        this.capacityMode = signal('marginal');
        this.capacityResult = computed(() => {
            const s = this.selectedSopForCap();
            // Use the locally fetched maps
            return s ? this.calcService.calculateCapacity(s, this.capacityMode(), this.capacityInventoryMap(), this.capacityRecipeMap() // Pass Recipe Map
            ) : null;
        });
        // Modal
        this.showModal = signal(false);
        this.isEditing = signal(false);
        this.oldStock = signal(0); // Theo dõi tồn kho cũ để ghi log
        this.form = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            category: ['reagent'],
            stock: [0, [Validators.required, Validators.min(0)]],
            unit: ['ml', Validators.required],
            threshold: [10],
            location: [''],
            supplier: [''],
            notes: [''],
            reason: ['', Validators.required],
            gtin: [''],
            lotNumber: [''],
            expiryDate: [''],
            casNumber: [''],
            englishName: [''],
            ghsWarnings: [[]],
            hazardStatements: [[]],
            precautionaryStatements: [[]]
        });
        this.unitOptions = UNIT_OPTIONS;
        this.isFetchingGhs = signal(false);
        // Helpers
        this.formatNum = formatNum;
        this.formatSmartUnit = formatSmartUnit;
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
            this.searchTerm.set(term);
            this.displayLimit.set(20); // Reset trang khi tìm kiếm
        });
    }
    ngOnInit() {
        // Check query params for GS1 auto-fill
        this.route.queryParams.subscribe(params => {
            if (params['action'] === 'scan_gs1') {
                this.handleGs1Scan(params);
            }
            else if (params['search']) {
                this.searchTerm.set(params['search']);
            }
        });
    }
    ngOnDestroy() { this.searchSubject.complete(); }
    // --- GS1 Auto-fill Logic ---
    handleGs1Scan(params) {
        const gtin = params['gtin'];
        const lot = params['lot'];
        const exp = params['exp'];
        // Try to find existing item by GTIN
        let existingItem = null;
        if (gtin) {
            existingItem = this.allItems().find(i => i.gtin === gtin || i.ref_code === gtin);
        }
        if (existingItem) {
            // Found item, open edit modal
            this.openModal(existingItem);
            this.toast.show(`Tìm thấy hóa chất: ${existingItem.name}`, 'success');
        }
        else {
            // Not found, open create modal
            this.openModal();
            this.toast.show('Hóa chất mới, vui lòng nhập thông tin', 'info');
        }
        // Auto-fill form fields
        this.form.patchValue({
            gtin: gtin || '',
            lotNumber: lot || '',
            expiryDate: exp || '',
            reason: 'Nhập kho (Scan QR)'
        });
    }
    // --- TAB SWITCH LOGIC ---
    async switchTab(tab) {
        this.activeTab.set(tab);
        if (tab === 'capacity' && Object.keys(this.capacityInventoryMap()).length === 0) {
            // Lazy load full inventory AND recipes for capacity calculation
            this.capacityLoading.set(true);
            try {
                // Fetch Both
                const [allItems, allRecipes] = await Promise.all([
                    this.inventoryService.getAllInventory(),
                    this.recipeService.getAllRecipes()
                ]);
                const invMap = {};
                allItems.forEach(i => invMap[i.id] = i);
                this.capacityInventoryMap.set(invMap);
                const recMap = {};
                allRecipes.forEach(r => recMap[r.id] = r);
                this.capacityRecipeMap.set(recMap);
            }
            catch (e) {
                console.error("Error loading full inventory for capacity", e);
            }
            finally {
                this.capacityLoading.set(false);
            }
        }
    }
    // Updated Icon Logic
    getIcon(cat) {
        if (!cat)
            return 'fa-flask';
        const c = cat.toLowerCase();
        if (c === 'solvent')
            return 'fa-droplet';
        if (c === 'standard')
            return 'fa-award'; // or fa-star
        if (c === 'reagent')
            return 'fa-flask';
        if (c === 'consumable')
            return 'fa-vial';
        if (c === 'kit')
            return 'fa-box-open';
        return 'fa-cube';
    }
    getIconGradient(item) {
        if (item.stock <= 0)
            return 'bg-gradient-to-tl from-red-600 to-rose-400';
        if (this.isLowStock(item))
            return 'bg-gradient-to-tl from-orange-500 to-yellow-400';
        const c = (item.category || '').toLowerCase();
        if (c === 'solvent')
            return 'bg-gradient-to-tl from-cyan-600 to-blue-400';
        if (c === 'standard')
            return 'bg-gradient-to-tl from-amber-500 to-yellow-300';
        return 'bg-gradient-to-tl from-purple-700 to-pink-500';
    }
    isLowStock(item) { return item.stock <= (item.threshold || 5); }
    // Stock Percentage for Gauge
    getStockPercent(item) {
        const safeLevel = (item.threshold || 5) * 3; // Assume 3x threshold is "Safe/Full"
        const ratio = item.stock / safeLevel;
        return Math.min(ratio * 100, 100);
    }
    // Resolve name specifically for capacity tab using local map
    resolveCapacityName(id) {
        const item = this.capacityInventoryMap()[id];
        return item ? (item.name || item.id) : id;
    }
    // Data Loading
    async refreshData() {
        // No-op: Data is automatically synchronized via StateService reactive cache.
        this.displayLimit.set(20);
        this.selectedIds.set(new Set());
    }
    loadMore() {
        this.displayLimit.update(l => l + 20);
    }
    onSearchInput(val) { this.searchSubject.next(val); }
    onFilterChange(val) {
        this.filterType.set(val);
        this.displayLimit.set(20); // Reset trang khi đổi bộ lọc
    }
    // Actions
    toggleSelection(id) { this.selectedIds.update(c => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
    openModal(item) {
        if (!this.auth.canEditInventory()) {
            this.toast.show('Bạn không có quyền sửa kho.', 'error');
            return;
        }
        this.showModal.set(true);
        if (item) {
            this.isEditing.set(true);
            this.oldStock.set(item.stock);
            this.form.patchValue({ ...item, reason: '' });
            this.form.controls.id.disable();
        }
        else {
            this.isEditing.set(false);
            this.oldStock.set(0);
            this.form.reset({ category: 'reagent', stock: 0, unit: 'ml', threshold: 5, reason: 'Tạo mới', ghsWarnings: [], hazardStatements: [], precautionaryStatements: [] });
            this.form.controls.id.enable();
        }
    }
    closeModal() {
        if (!this.isProcessing()) {
            this.showModal.set(false);
        }
    }
    onNameChange(e) { if (!this.isEditing())
        this.form.patchValue({ id: generateSlug(e.target.value) }); }
    // --- Pubchem Integration ---
    async fetchPubChem() {
        const cas = this.form.get('casNumber')?.value;
        const engName = this.form.get('englishName')?.value;
        const query = cas || engName;
        if (!query) {
            this.toast.show('Vui lòng nhập Tên tiếng Anh hoặc mã CAS để tự động bắt GHS.', 'error');
            return;
        }
        this.isFetchingGhs.set(true);
        try {
            const result = await this.pubchem.fetchGHS(query);
            if (result && (result.pictograms.length > 0 || result.hazardStatements.length > 0 || result.precautionaryStatements.length > 0)) {
                this.form.patchValue({
                    ghsWarnings: result.pictograms,
                    hazardStatements: result.hazardStatements,
                    precautionaryStatements: result.precautionaryStatements
                });
                this.toast.show(`Thành công! Tìm thấy ${result.pictograms.length} GHS, ${result.hazardStatements.length} H-statements từ PubChem.`, 'success');
            }
            else {
                this.toast.show('PubChem không có thẻ GHS cho hóa chất này.', 'info');
            }
        }
        catch (e) {
            this.toast.show('Lỗi kết nối PubChem.', 'error');
        }
        finally {
            this.isFetchingGhs.set(false);
        }
    }
    toggleGhs(code) {
        const current = this.form.get('ghsWarnings')?.value || [];
        if (current.includes(code)) {
            this.form.patchValue({ ghsWarnings: current.filter(c => c !== code) });
        }
        else {
            this.form.patchValue({ ghsWarnings: [...current, code] });
        }
    }
    // --- HARDENED UX: Save Item ---
    async save() {
        if (this.isProcessing())
            return;
        if (this.form.invalid) {
            this.toast.show('Vui lòng nhập đầy đủ thông tin và Lý do thay đổi!', 'error');
            return;
        }
        this.isProcessing.set(true);
        try {
            const raw = this.form.getRawValue();
            const reason = raw.reason || '';
            const { reason: _, ...itemData } = raw;
            await this.inventoryService.upsertItem(itemData, !this.isEditing(), reason, this.oldStock());
            this.toast.show(this.isEditing() ? 'Đã cập nhật' : 'Đã thêm mới', 'success');
            this.showModal.set(false);
            this.refreshData();
        }
        catch (e) {
            if (e.code === 'resource-exhausted') {
                this.toast.show('Lỗi: Hết dung lượng lưu trữ (Quota).', 'error');
            }
            else {
                this.toast.show('Lỗi lưu kho: ' + (e.message || 'Unknown'), 'error');
            }
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    // --- HARDENED UX: Delete Item ---
    async deleteItem(item) {
        if (this.isProcessing())
            return;
        if (await this.confirmationService.confirm({ message: 'Xóa mục này? Hành động này cần được ghi nhận.', confirmText: 'Xác nhận Xóa', isDangerous: true })) {
            this.isProcessing.set(true);
            try {
                await this.inventoryService.deleteItem(item.id, 'Xóa thủ công');
                this.toast.show('Đã xóa thành công', 'success');
                this.showModal.set(false);
                this.refreshData();
            }
            catch (e) {
                this.toast.show('Lỗi xóa: ' + e.message, 'error');
            }
            finally {
                this.isProcessing.set(false);
            }
        }
    }
    // --- HARDENED UX: Quick Update ---
    async quickUpdate(item, valStr) {
        if (this.isProcessing())
            return;
        const val = parseQuantityInput(valStr, item.unit);
        if (val === null) {
            this.toast.show(`Lỗi: Đơn vị không khớp hoặc định dạng sai. Yêu cầu nhập theo (${item.unit}) hoặc quy đổi tương đương.`, 'error');
            return;
        }
        if (val === 0)
            return;
        this.isProcessing.set(true);
        try {
            const reason = val > 0 ? 'Nhập nhanh' : 'Xuất nhanh';
            await this.inventoryService.updateStock(item.id, item.stock, val, reason);
            const msg = val > 0 ? `Đã nhập +${val} ${item.unit}` : `Đã xuất ${val} ${item.unit}`;
            this.toast.show(msg, 'success');
            this.refreshData();
        }
        catch (e) {
            this.toast.show('Lỗi cập nhật kho: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    static { this.ɵfac = function InventoryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || InventoryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: InventoryComponent, selectors: [["app-inventory"]], decls: 27, vars: 13, consts: [["quickInputMobile", ""], ["quickInput", ""], [1, "flex", "flex-col", "space-y-4", "md:space-y-6", "fade-in", "h-full", "relative", "p-2", "md:p-4"], [1, "flex", "flex-col", "md:flex-row", "md:items-center", "justify-between", "gap-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "border", "border-slate-100", "dark:border-slate-700", "shrink-0", "mx-4", "md:mx-0"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-900/30", "text-indigo-650", "dark:text-indigo-400", "flex", "items-center", "justify-center", "border", "border-indigo-100", "dark:border-indigo-800/30", "shadow-sm", "shrink-0"], [1, "fa-solid", "fa-boxes-stacked", "text-base"], [1, "text-xl", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight"], [1, "text-xs", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "xl:grid-cols-4", "gap-4", "md:gap-6", "shrink-0", "pt-4", "px-4", "md:pt-0", "md:px-0"], [1, "flex-1", "bg-transparent", "md:bg-white", "md:dark:bg-slate-800", "rounded-none", "md:rounded-2xl", "shadow-none", "md:shadow-sm", "dark:shadow-none", "flex", "flex-col", "overflow-hidden", "border-0", "md:border", "md:border-slate-200", "md:dark:border-slate-700"], [1, "p-4", "border-b", "border-slate-100", "dark:border-slate-700/50", "flex", "flex-col", "gap-4", "shrink-0", "bg-white", "dark:bg-slate-800", "sticky", "top-0", "z-20", "shadow-sm", "md:shadow-none", "dark:shadow-none"], [1, "flex", "p-1", "bg-slate-100", "dark:bg-slate-900/50", "rounded-xl"], [1, "flex-1", "text-xs", "font-bold", "uppercase", "tracking-wider", "py-2", "rounded-lg", "transition", "active:scale-95", 3, "click"], [1, "flex-1", "text-xs", "font-bold", "uppercase", "tracking-wider", "py-2", "rounded-lg", "transition", "active:scale-95", "flex", "items-center", "justify-center", "gap-1", 3, "click"], [1, "fa-solid", "fa-tag"], [1, "flex", "gap-2"], [1, "flex-1", "overflow-y-auto", "px-0", "py-0", "custom-scrollbar", "relative", "bg-slate-50/50", "dark:bg-slate-900/20"], [1, "flex", "flex-col", "md:flex-row", "flex-1", "min-h-0", "overflow-hidden"], [1, "flex-1", "min-h-0", "w-full", "flex", "flex-col"], [1, "md:hidden", "fixed", "bottom-20", "right-4", "w-14", "h-14", "bg-slate-900", "dark:bg-slate-700", "text-white", "rounded-full", "shadow-lg", "shadow-slate-400", "dark:shadow-none", "flex", "items-center", "justify-center", "z-30", "transition-transform", "active:scale-90", "animate-bounce-in", 3, "appLockPermission"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "shadow-sm", "dark:shadow-none", "p-4", "flex", "items-center", "gap-4", "relative", "overflow-hidden", "group", "border", "border-slate-200", "dark:border-slate-700", "active:scale-95", "transition-all", "duration-200", "h-20", "md:h-24"], [1, "w-12", "h-12", "rounded-xl", "bg-gradient-to-br", "from-indigo-500", "to-blue-500", "flex", "items-center", "justify-center", "text-white", "shadow-lg", "shadow-indigo-200", "dark:shadow-none", "group-hover:scale-110", "transition-transform"], [1, "fa-solid", "fa-boxes-stacked"], [1, "text-[10px]", "font-bold", "text-slate-400", "uppercase", "tracking-wide", "mb-0"], ["width", "60px", "height", "24px"], [1, "font-black", "text-slate-700", "dark:text-slate-100", "text-xl"], [1, "relative", "flex-1"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-3", "text-slate-400", "dark:text-slate-500", "text-xs"], ["placeholder", "T\u00ECm ki\u1EBFm...", 1, "pl-9", "pr-4", "py-2.5", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "text-xs", "focus:border-fuchsia-500", "dark:focus:border-fuchsia-500", "outline-none", "transition", "w-full", "shadow-sm", "dark:shadow-none", "bg-slate-50", "dark:bg-slate-900/50", "focus:bg-white", "dark:focus:bg-slate-800", "font-bold", "text-slate-700", "dark:text-slate-300", 3, "ngModelChange", "ngModel"], [1, "w-1/3", "md:w-48"], [1, "w-full", "h-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-2", "text-xs", "outline-none", "text-slate-600", "dark:text-slate-300", "font-bold", "focus:border-fuchsia-500", "dark:focus:border-fuchsia-500", "shadow-sm", "dark:shadow-none", "bg-slate-50", "dark:bg-slate-900/50", "focus:bg-white", "dark:focus:bg-slate-800", "cursor-pointer", "transition", 3, "ngModelChange", "ngModel"], ["value", "all"], [3, "value"], ["value", "low"], [1, "hidden", "md:flex", "bg-slate-800", "dark:bg-slate-700", "text-white", "px-4", "py-2", "rounded-xl", "text-xs", "font-bold", "uppercase", "shadow-sm", "dark:shadow-none", "hover:bg-black", "dark:hover:bg-slate-600", "transition", "items-center", "gap-2", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-plus"], [1, "md:hidden", "p-4", "space-y-3", "pb-24"], [1, "hidden", "md:table", "w-full", "text-left", "border-collapse", "align-middle", "relative"], [1, "text-slate-500", "dark:text-slate-400", "text-[10px]", "font-bold", "uppercase", "bg-slate-50", "dark:bg-slate-900/50", "border-b", "border-slate-200", "dark:border-slate-700", "sticky", "top-0", "z-10", "shadow-sm", "dark:shadow-none"], [1, "px-4", "py-2", "pl-6", "w-[40%]"], [1, "px-4", "py-2", "border-l", "border-slate-100", "dark:border-slate-700/50"], [1, "px-4", "py-2", "text-center", "border-l", "border-slate-100", "dark:border-slate-700/50", "w-20"], [1, "px-4", "py-2", "text-right", "border-l", "border-slate-100", "dark:border-slate-700/50", "w-32"], ["class", "px-4 py-2 text-right border-l border-slate-100 dark:border-slate-700/50 w-32", 4, "appHasPermission"], [1, "px-4", "py-2", "text-center", "w-12", "border-l", "border-slate-100", "dark:border-slate-700/50"], [1, "text-sm", "text-slate-600", "dark:text-slate-400"], [1, "bg-white", "dark:bg-slate-800", "hover:bg-blue-50/50", "dark:hover:bg-slate-700/30", "transition", "group", "cursor-pointer", "border-b", "border-slate-50", "dark:border-slate-700/50"], [1, "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-slate-100", "dark:border-slate-700", "space-y-3"], ["width", "40px", "height", "40px", "shape", "rect"], [1, "flex-1", "space-y-1"], ["width", "70%", "height", "16px"], ["width", "40%", "height", "12px"], [1, "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-slate-200", "dark:border-slate-700", "active:scale-98", "transition-transform"], [1, "text-center", "py-10", "text-slate-400", "dark:text-slate-500", "italic"], [1, "w-full", "py-3", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "shadow-sm", "dark:shadow-none"], [1, "bg-white", "dark:bg-slate-800", "p-4", "rounded-2xl", "shadow-sm", "dark:shadow-none", "border", "border-slate-200", "dark:border-slate-700", "active:scale-98", "transition-transform", 3, "click"], [1, "flex", "justify-between", "items-start", "mb-2"], [1, "w-10", "h-10", "rounded-xl", "flex", "items-center", "justify-center", "text-white", "shadow-sm", "dark:shadow-none", "shrink-0"], [1, "fa-solid"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "text-sm", "leading-tight", "line-clamp-2"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500", "font-mono", "bg-slate-50", "dark:bg-slate-900/50", "px-1.5", "rounded", "border", "border-slate-100", "dark:border-slate-700/50"], [1, "flex", "gap-1", "mt-1"], [1, "fa-solid", "fa-circle-exclamation", "text-orange-500", "dark:text-orange-400", "animate-pulse"], [1, "flex", "flex-col", "gap-3", "border-t", "border-slate-50", "dark:border-slate-700/50", "pt-3", "mt-1"], [1, "flex", "items-end", "justify-between"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase"], [1, "text-lg", "font-black", "text-slate-700", "dark:text-slate-200", "leading-none"], [1, "text-xs", "font-bold", "text-slate-400", "dark:text-slate-500"], [1, "text-[10px]", "font-bold", "uppercase", "bg-slate-100", "dark:bg-slate-700", "text-slate-500", "dark:text-slate-400", "px-2", "py-1", "rounded"], [1, "flex", "items-center", "justify-end", 3, "click", "appLockPermission"], [1, "flex", "items-center", "gap-2"], ["type", "text", "inputmode", "text", 1, "w-24", "px-2", "py-1.5", "text-xs", "border", "border-slate-200", "dark:border-slate-600", "rounded-lg", "text-center", "focus:border-fuchsia-500", "dark:focus:border-fuchsia-500", "outline-none", "font-bold", "text-slate-700", "dark:text-slate-300", "font-mono", "bg-slate-50", "dark:bg-slate-900/50", 3, "keyup.enter", "disabled", "placeholder"], [1, "h-8", "px-3", "flex", "items-center", "justify-center", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "transition", "shadow-sm", "dark:shadow-none", "text-[11px]", "font-bold", "gap-1.5", 3, "click"], [1, "fa-solid", "fa-bolt"], [1, "w-4", "h-4", "opacity-70", 3, "src", "title"], [1, "w-full", "py-3", "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "shadow-sm", "dark:shadow-none", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "hover:bg-blue-50/50", "dark:hover:bg-slate-700/30", "transition", "group", "cursor-pointer", "border-b", "border-slate-50", "dark:border-slate-700/50", 3, "click"], [1, "px-4", "py-2", "pl-6"], [1, "w-8", "h-8", "rounded-lg", "flex", "items-center", "justify-center", "text-white", "shadow-sm", "dark:shadow-none", "shrink-0"], [1, "fa-solid", "text-xs"], [1, "flex", "flex-col", "min-w-0", "flex-1"], [1, "mb-0", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "leading-tight", "truncate"], [1, "flex", "items-center", "gap-2", "mt-0.5"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "font-mono"], [1, "flex", "gap-0.5", "opacity-60"], [1, "px-4", "py-2", "border-l", "border-slate-50", "dark:border-slate-700/50"], [1, "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "bg-slate-100", "dark:bg-slate-700", "px-2", "py-0.5", "rounded"], [1, "px-4", "py-2", "text-center", "border-l", "border-slate-50", "dark:border-slate-700/50"], [1, "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "px-4", "py-2", "text-right", "border-l", "border-slate-50", "dark:border-slate-700/50"], [1, "flex", "flex-col", "items-end", "w-full"], [1, "font-mono", "font-bold", "text-sm", "tracking-tight", 3, "innerHTML"], [1, "w-full", "h-1.5", "bg-slate-200", "dark:bg-slate-700", "rounded-full", "mt-1", "overflow-hidden"], [1, "h-full", "rounded-full"], ["class", "px-4 py-2 text-right border-l border-slate-50 dark:border-slate-700/50", 3, "click", 4, "appHasPermission"], [1, "px-4", "py-2", "text-center", "border-l", "border-slate-50"], [1, "text-blue-600", "hover:text-blue-800", "transition", "px-1", 3, "click"], [1, "fa-solid", "fa-pen", "text-xs"], [1, "w-[14px]", "h-[14px]", 3, "src", "title"], [1, "px-4", "py-2", "text-right", "border-l", "border-slate-50", "dark:border-slate-700/50", 3, "click"], [1, "flex", "items-center", "justify-end", "gap-1", "opacity-0", "group-hover:opacity-100", "transition", "duration-200"], ["type", "text", 1, "w-20", "px-1", "py-0.5", "text-[10px]", "border", "border-slate-200", "dark:border-slate-600", "rounded", "text-center", "focus:border-fuchsia-500", "dark:focus:border-fuchsia-500", "outline-none", "font-bold", "text-slate-700", "dark:text-slate-300", "font-mono", "bg-white", "dark:bg-slate-800", 3, "keyup.enter", "disabled", "placeholder"], [1, "w-6", "h-6", "flex", "items-center", "justify-center", "rounded", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "transition", "shadow-sm", "dark:shadow-none", 3, "click"], [1, "fa-solid", "fa-check", "text-[10px]"], [1, "w-full", "md:w-72", "border-r", "border-slate-100", "dark:border-slate-700/50", "overflow-y-auto", "p-3", "bg-slate-50/50", "dark:bg-slate-900/20", "h-1/3", "md:h-full", "shrink-0"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "pl-1", "mb-2", "sticky", "top-0", "bg-slate-50/50", "dark:bg-slate-900/50", "backdrop-blur-sm", "py-1", "z-10"], [1, "p-2.5", "rounded-lg", "mb-1.5", "cursor-pointer", "transition", "flex", "items-center", "gap-3", "hover:bg-white", "dark:hover:bg-slate-800", "hover:shadow-sm", "dark:hover:shadow-none", "active:scale-95", "border", 3, "class"], [1, "flex-1", "p-4", "md:p-6", "overflow-y-auto", "bg-white", "dark:bg-slate-800", "h-2/3", "md:h-full", "relative", "pb-24", "md:pb-6"], [1, "absolute", "inset-0", "bg-white/80", "dark:bg-slate-800/80", "z-20", "flex", "items-center", "justify-center", "flex-col"], [1, "h-full", "flex", "items-center", "justify-center", "text-slate-300", "dark:text-slate-600", "flex-col"], [1, "p-2.5", "rounded-lg", "mb-1.5", "cursor-pointer", "transition", "flex", "items-center", "gap-3", "hover:bg-white", "dark:hover:bg-slate-800", "hover:shadow-sm", "dark:hover:shadow-none", "active:scale-95", "border", 3, "click"], [1, "text-[9px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "leading-tight", "line-clamp-1"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-2xl", "text-fuchsia-500", "dark:text-fuchsia-400", "mb-2"], [1, "text-xs", "font-bold", "text-slate-500", "dark:text-slate-400"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-start", "mb-4", "gap-4"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "text-lg"], [1, "flex", "gap-2", "mt-1"], [1, "px-2", "py-1", "text-[10px]", "font-bold", "rounded", "border", "transition", "active:scale-95", 3, "click"], [1, "text-right", "bg-slate-50", "dark:bg-slate-900/50", "p-2", "rounded-lg", "border", "border-slate-100", "dark:border-slate-700/50", "w-full", "md:w-auto", "flex", "justify-between", "md:block", "items-center"], [1, "text-xl", "md:text-2xl", "font-black", "text-fuchsia-600", "dark:text-fuchsia-400"], [1, "text-xs", "text-slate-400", "dark:text-slate-500", "font-normal"], [1, "mb-4", "bg-orange-50", "dark:bg-orange-900/10", "border", "border-orange-100", "dark:border-orange-900/30", "rounded-lg", "p-3", "flex", "items-start", "gap-2"], [1, "border", "border-slate-100", "dark:border-slate-700", "rounded-xl", "overflow-hidden", "shadow-sm", "dark:shadow-none"], [1, "w-full", "text-xs", "text-left"], [1, "bg-slate-50", "dark:bg-slate-900/50", "text-[9px]", "text-slate-500", "dark:text-slate-400", "uppercase", "font-bold"], [1, "px-4", "py-2", "border-b", "border-slate-100", "dark:border-slate-700/50"], [1, "px-4", "py-2", "text-right", "border-b", "border-slate-100", "dark:border-slate-700/50"], [1, "px-4", "py-2", "text-center", "border-b", "border-slate-100", "dark:border-slate-700/50"], [1, "divide-y", "divide-slate-50", "dark:divide-slate-700/50"], [1, "hover:bg-slate-50", "dark:hover:bg-slate-700/30", "transition"], [1, "fa-solid", "fa-triangle-exclamation", "text-orange-500", "dark:text-orange-400", "mt-0.5", "text-xs"], [1, "text-[10px]", "font-bold", "text-orange-800", "dark:text-orange-500", "uppercase"], [1, "text-xs", "text-orange-700", "dark:text-orange-400", "mt-0.5"], [1, "dark:text-orange-300"], [1, "px-4", "py-2", "font-bold", "text-slate-700", "dark:text-slate-300", "border-r", "border-slate-50/50", "dark:border-slate-700/30"], [1, "px-4", "py-2", "text-right", "text-slate-500", "dark:text-slate-400", "font-mono", "border-r", "border-slate-50/50", "dark:border-slate-700/30"], [1, "px-4", "py-2", "text-center", "font-bold", "font-mono", "dark:text-slate-300"], [1, "fa-solid", "fa-chart-pie", "text-4xl", "mb-2"], [1, "text-xs", "font-bold"], [1, "flex-1", "min-h-0", "w-full", "block"], [1, "md:hidden", "fixed", "bottom-20", "right-4", "w-14", "h-14", "bg-slate-900", "dark:bg-slate-700", "text-white", "rounded-full", "shadow-lg", "shadow-slate-400", "dark:shadow-none", "flex", "items-center", "justify-center", "z-30", "transition-transform", "active:scale-90", "animate-bounce-in", 3, "click", "appLockPermission"], [1, "fa-solid", "fa-plus", "text-xl"], [1, "fixed", "inset-0", "z-[99]", "flex", "items-end", "md:items-center", "justify-center", "bg-black/30", "dark:bg-black/50", "backdrop-blur-sm", "fade-in", 3, "click"], [1, "bg-white", "dark:bg-slate-800", "w-full", "md:max-w-2xl", "overflow-hidden", "flex", "flex-col", "animate-slide-up", "shadow-2xl", "dark:shadow-none", "rounded-t-2xl", "md:rounded-2xl", "h-[85vh]", "md:h-auto", "md:max-h-[90vh]", 3, "click"], [1, "p-4", "border-b", "border-slate-100", "dark:border-slate-700/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-bold", "text-slate-800", "dark:text-slate-100", "text-base"], [1, "text-[10px]", "text-slate-400", "dark:text-slate-500"], [1, "w-8", "h-8", "rounded-full", "bg-slate-50", "dark:bg-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-300", "hover:text-slate-600", "dark:hover:text-slate-100", "hover:bg-slate-100", "dark:hover:bg-slate-600", "transition", "active:scale-90", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-y-auto", "p-5", "md:p-6", "bg-slate-50", "dark:bg-slate-900/50", "custom-scrollbar"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], [1, "text-[10px]", "font-bold", "text-slate-500", "dark:text-slate-400", "uppercase", "ml-1", "block", "mb-1"], ["formControlName", "name", "placeholder", "Nh\u1EADp t\u00EAn h\u00F3a ch\u1EA5t...", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-4", "py-3", "text-sm", "focus:border-fuchsia-500", "dark:focus:border-fuchsia-500", "outline-none", "transition", "shadow-sm", "dark:shadow-none", "font-bold", "text-slate-700", "dark:text-slate-200", "bg-white", "dark:bg-slate-800", 3, "input"], [1, "grid", "grid-cols-2", "gap-4"], ["formControlName", "id", "placeholder", "auto-gen", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "font-mono", "text-slate-600", "dark:text-slate-400", "outline-none", "shadow-sm", "dark:shadow-none", "bg-slate-100", "dark:bg-slate-700/50", "focus:bg-white", "dark:focus:bg-slate-800", "transition", 3, "readonly"], ["formControlName", "category", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "shadow-sm", "dark:shadow-none", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "cursor-pointer", "h-[38px]"], ["value", "", "disabled", ""], ["formControlName", "englishName", "placeholder", "VD: Methanol", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "shadow-sm", "dark:shadow-none"], ["formControlName", "casNumber", "placeholder", "VD: 67-56-1", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "shadow-sm", "dark:shadow-none"], [1, "bg-yellow-50", "dark:bg-yellow-900/10", "p-3", "rounded-xl", "border", "border-yellow-200", "dark:border-yellow-800/30", "space-y-3"], [1, "flex", "justify-between", "items-center"], [1, "text-[10px]", "font-bold", "text-yellow-800", "dark:text-yellow-500", "uppercase", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-shield-virus"], ["type", "button", 1, "text-[10px]", "bg-yellow-400", "dark:bg-yellow-600/50", "hover:bg-yellow-500", "text-yellow-900", "dark:text-yellow-100", "px-3", "py-1.5", "rounded-lg", "border", "border-yellow-500", "dark:border-none", "font-bold", "transition", "flex", "items-center", "gap-1", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"], [1, "grid", "grid-cols-3", "sm:grid-cols-5", "gap-2"], [1, "cursor-pointer", "border", "rounded-lg", "p-1.5", "flex", "flex-col", "items-center", "text-center", "transition", "active:scale-95", "bg-white", "dark:bg-slate-800", "opacity-60", "hover:opacity-100", 3, "class"], [1, "mt-3", "space-y-2", "max-h-40", "overflow-y-auto", "custom-scrollbar", "text-[10px]", "p-2", "bg-white", "dark:bg-slate-800", "rounded", "border", "border-yellow-200", "dark:border-yellow-800/30"], [1, "grid", "grid-cols-2", "gap-4", "bg-white", "dark:bg-slate-800", "p-4", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "dark:shadow-none"], ["type", "number", "formControlName", "stock", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-4", "py-2.5", "text-lg", "font-bold", "text-fuchsia-600", "dark:text-fuchsia-400", "outline-none", "bg-slate-50", "dark:bg-slate-900/50", "focus:bg-white", "dark:focus:bg-slate-800", "transition", "text-center"], ["formControlName", "unit", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-4", "py-2.5", "text-xs", "outline-none", "bg-slate-50", "dark:bg-slate-900/50", "focus:bg-white", "dark:focus:bg-slate-800", "text-slate-700", "dark:text-slate-200", "transition", "h-[48px]"], ["formControlName", "location", "placeholder", "VD: T\u1EE7 A", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "shadow-sm", "dark:shadow-none", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200"], ["type", "number", "formControlName", "threshold", "placeholder", "5", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "shadow-sm", "dark:shadow-none", "bg-white", "dark:bg-slate-800", "font-bold", "text-orange-500", "dark:text-orange-400"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-4", "bg-blue-50/50", "dark:bg-blue-900/10", "p-4", "rounded-xl", "border", "border-blue-100", "dark:border-blue-800/30"], [1, "text-[10px]", "font-bold", "text-blue-600", "dark:text-blue-400", "uppercase", "ml-1", "block", "mb-1"], ["formControlName", "gtin", "placeholder", "VD: 04059081234567", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "shadow-sm", "dark:shadow-none", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200"], ["formControlName", "lotNumber", "placeholder", "VD: A12345678", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "shadow-sm", "dark:shadow-none", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200"], ["type", "date", "formControlName", "expiryDate", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-3", "py-2.5", "text-xs", "outline-none", "shadow-sm", "dark:shadow-none", "bg-white", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200"], [1, "pt-2", "border-t", "border-slate-200", "dark:border-slate-700/50"], [1, "text-[10px]", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "ml-1", "block", "mb-1"], [1, "text-red-500", "dark:text-red-400"], ["formControlName", "reason", "placeholder", "VD: Nh\u1EADp kho, Ki\u1EC3m k\u00EA, V\u1EE1 h\u1ECFng...", "required", "", 1, "w-full", "border", "border-slate-200", "dark:border-slate-600", "rounded-xl", "px-4", "py-3", "text-xs", "outline-none", "shadow-sm", "dark:shadow-none", "bg-yellow-50", "dark:bg-yellow-900/20", "focus:bg-white", "dark:focus:bg-slate-800", "text-slate-700", "dark:text-slate-200", "transition", "placeholder-slate-400", "dark:placeholder-slate-500"], [1, "pt-4", "flex", "gap-3", "pb-safe"], ["type", "button", 1, "flex-1", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "py-3.5", "rounded-xl", "font-bold", "text-xs", "shadow-sm", "dark:shadow-none", "hover:bg-red-100", "dark:hover:bg-red-900/40", "transition", "active:scale-95", "disabled:opacity-50", 3, "disabled"], ["type", "submit", 1, "flex-[3]", "bg-slate-800", "dark:bg-slate-700", "text-white", "py-3.5", "rounded-xl", "font-bold", "text-xs", "shadow-md", "dark:shadow-none", "hover:shadow-lg", "hover:bg-black", "dark:hover:bg-slate-600", "transition", "transform", "active:scale-95", "disabled:opacity-50", 3, "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-bolt", "text-red-600", "dark:text-red-400"], [1, "cursor-pointer", "border", "rounded-lg", "p-1.5", "flex", "flex-col", "items-center", "text-center", "transition", "active:scale-95", "bg-white", "dark:bg-slate-800", "opacity-60", "hover:opacity-100", 3, "click"], [1, "w-8", "h-8", "sm:w-10", "sm:h-10", "mb-1", 3, "src", "alt"], [1, "text-[8px]", "font-bold", "text-slate-600", "dark:text-slate-400", "leading-tight", "w-full", "truncate", 3, "title"], [1, "mt-2", "text-blue-600", "dark:text-blue-400"], [1, "text-red-600", "dark:text-red-400"], [1, "list-disc", "pl-4", "text-slate-600", "dark:text-slate-400", "mt-1"], ["type", "button", 1, "flex-1", "bg-red-50", "dark:bg-red-900/20", "text-red-600", "dark:text-red-400", "py-3.5", "rounded-xl", "font-bold", "text-xs", "shadow-sm", "dark:shadow-none", "hover:bg-red-100", "dark:hover:bg-red-900/40", "transition", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"]], template: function InventoryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "div", 5);
            i0.ɵɵelement(4, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div")(6, "h2", 7);
            i0.ɵɵtext(7, "Qu\u1EA3n L\u00FD Kho H\u00F3a Ch\u1EA5t");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 8);
            i0.ɵɵtext(9, "Nh\u1EADt k\u00FD t\u1ED3n kho, th\u00F4ng tin \u0111\u1ECBnh l\u01B0\u1EE3ng v\u00E0 c\u1EA3nh b\u00E1o h\u1EA1n d\u00F9ng.");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵtemplate(10, InventoryComponent_Conditional_10_Template, 9, 1, "div", 9);
            i0.ɵɵelementStart(11, "div", 10)(12, "div", 11)(13, "div", 12)(14, "button", 13);
            i0.ɵɵlistener("click", function InventoryComponent_Template_button_click_14_listener() { return ctx.switchTab("list"); });
            i0.ɵɵtext(15, " Danh S\u00E1ch ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "button", 13);
            i0.ɵɵlistener("click", function InventoryComponent_Template_button_click_16_listener() { return ctx.switchTab("capacity"); });
            i0.ɵɵtext(17, " N\u0103ng L\u1EF1c ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 14);
            i0.ɵɵlistener("click", function InventoryComponent_Template_button_click_18_listener() { return ctx.switchTab("labels"); });
            i0.ɵɵelement(19, "i", 15);
            i0.ɵɵtext(20, " Tem ");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(21, InventoryComponent_Conditional_21_Template, 15, 3, "div", 16);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(22, InventoryComponent_Conditional_22_Template, 20, 2, "div", 17)(23, InventoryComponent_Conditional_23_Template, 10, 2, "div", 18)(24, InventoryComponent_Conditional_24_Template, 2, 0, "div", 19);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(25, InventoryComponent_Conditional_25_Template, 2, 1, "button", 20)(26, InventoryComponent_Conditional_26_Template, 3, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(10);
            i0.ɵɵconditional(ctx.activeTab() !== "labels" ? 10 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵclassMap(ctx.activeTab() === "list" ? "text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.activeTab() === "capacity" ? "text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.activeTab() === "labels" ? "text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.activeTab() === "list" ? 21 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeTab() === "list" ? 22 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeTab() === "capacity" ? 23 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeTab() === "labels" ? 24 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.activeTab() === "list" ? 25 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showModal() ? 26 : -1);
        } }, dependencies: [CommonModule, FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel, ReactiveFormsModule, SkeletonComponent, LabelPrintComponent, HasPermissionDirective, LockPermissionDirective], styles: ["@keyframes _ngcontent-%COMP%_slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }\n    .animate-slide-up[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }\n    .pb-safe[_ngcontent-%COMP%] { padding-bottom: env(safe-area-inset-bottom, 20px); }"], changeDetection: 0 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InventoryComponent, [{
        type: Component,
        args: [{ selector: 'app-inventory', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, SkeletonComponent, LabelPrintComponent, HasPermissionDirective, LockPermissionDirective], changeDetection: ChangeDetectionStrategy.OnPush, template: "    <div class=\"flex flex-col space-y-4 md:space-y-6 fade-in h-full relative p-2 md:p-4\">\r\n      <!-- Header Area -->\r\n      <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 shrink-0 mx-4 md:mx-0\">\r\n          <div class=\"flex items-center gap-3\">\r\n              <div class=\"w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-650 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shadow-sm shrink-0\">\r\n                  <i class=\"fa-solid fa-boxes-stacked text-base\"></i>\r\n              </div>\r\n              <div>\r\n                  <h2 class=\"text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight\">Qu\u1EA3n L\u00FD Kho H\u00F3a Ch\u1EA5t</h2>\r\n                  <p class=\"text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5\">Nh\u1EADt k\u00FD t\u1ED3n kho, th\u00F4ng tin \u0111\u1ECBnh l\u01B0\u1EE3ng v\u00E0 c\u1EA3nh b\u00E1o h\u1EA1n d\u00F9ng.</p>\r\n              </div>\r\n          </div>\r\n      </div>\r\n\r\n      <!-- Statistics Card Row (Only show for List/Capacity tabs) -->\r\n      @if (activeTab() !== 'labels') {\r\n          <div class=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 shrink-0 pt-4 px-4 md:pt-0 md:px-0\">\r\n              <div class=\"bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-none p-4 flex items-center gap-4 relative overflow-hidden group border border-slate-200 dark:border-slate-700 active:scale-95 transition-all duration-200 h-20 md:h-24\">\r\n                  <div class=\"w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform\">\r\n                      <i class=\"fa-solid fa-boxes-stacked\"></i>\r\n                  </div>\r\n                  <div>\r\n                      <p class=\"text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0\">T\u1ED5ng s\u1ED1 h\u00F3a ch\u1EA5t</p>\r\n                      @if(totalCount() === null) {\r\n                          <app-skeleton width=\"60px\" height=\"24px\"></app-skeleton>\r\n                      } @else {\r\n                          <h5 class=\"font-black text-slate-700 dark:text-slate-100 text-xl\">{{totalCount()}}</h5>\r\n                      }\r\n                  </div>\r\n              </div>\r\n          </div>\r\n      }\r\n\r\n      <!-- Main Content Card -->\r\n      <div class=\"flex-1 bg-transparent md:bg-white md:dark:bg-slate-800 rounded-none md:rounded-2xl shadow-none md:shadow-sm dark:shadow-none flex flex-col overflow-hidden border-0 md:border md:border-slate-200 md:dark:border-slate-700\">\r\n        <!-- Header Actions -->\r\n        <div class=\"p-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col gap-4 shrink-0 bg-white dark:bg-slate-800 sticky top-0 z-20 shadow-sm md:shadow-none dark:shadow-none\">\r\n            <!-- Mobile Tab Switcher -->\r\n            <div class=\"flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl\">\r\n                <button (click)=\"switchTab('list')\" \r\n                   class=\"flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95\"\r\n                   [class]=\"activeTab() === 'list' ? 'text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'\">\r\n                   Danh S\u00E1ch\r\n                </button>\r\n                <button (click)=\"switchTab('capacity')\" \r\n                   class=\"flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95\"\r\n                   [class]=\"activeTab() === 'capacity' ? 'text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'\">\r\n                   N\u0103ng L\u1EF1c\r\n                </button>\r\n                <button (click)=\"switchTab('labels')\" \r\n                   class=\"flex-1 text-xs font-bold uppercase tracking-wider py-2 rounded-lg transition active:scale-95 flex items-center justify-center gap-1\"\r\n                   [class]=\"activeTab() === 'labels' ? 'text-white bg-slate-800 dark:bg-slate-700 shadow-md dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'\">\r\n                   <i class=\"fa-solid fa-tag\"></i> Tem\r\n                </button>\r\n            </div>\r\n            \r\n            @if(activeTab() === 'list') {\r\n                <div class=\"flex gap-2\">\r\n                    <div class=\"relative flex-1\">\r\n                        <i class=\"fa-solid fa-search absolute left-3 top-3 text-slate-400 dark:text-slate-500 text-xs\"></i>\r\n                        <input [ngModel]=\"searchTerm()\" (ngModelChange)=\"onSearchInput($event)\" \r\n                               placeholder=\"T\u00ECm ki\u1EBFm...\" \r\n                               class=\"pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-xs focus:border-fuchsia-500 dark:focus:border-fuchsia-500 outline-none transition w-full shadow-sm dark:shadow-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 font-bold text-slate-700 dark:text-slate-300\">\r\n                    </div>\r\n                    <div class=\"w-1/3 md:w-48\">\r\n                        <select [ngModel]=\"filterType()\" (ngModelChange)=\"onFilterChange($event)\" class=\"w-full h-full border border-slate-200 dark:border-slate-600 rounded-xl px-2 text-xs outline-none text-slate-600 dark:text-slate-300 font-bold focus:border-fuchsia-500 dark:focus:border-fuchsia-500 shadow-sm dark:shadow-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 cursor-pointer transition\">\r\n                            <option value=\"all\">T\u1EA5t c\u1EA3</option>\r\n                            @for(cat of state.categories(); track cat.id) {\r\n                                <option [value]=\"cat.id\">{{cat.name}}</option>\r\n                            }\r\n                            <option value=\"low\">S\u1EAFp h\u1EBFt</option>\r\n                        </select>\r\n                    </div>\r\n                    <!-- Desktop Add Button (Hidden on Mobile) -->\r\n                    <button [appLockPermission]=\"'inventory_edit'\" (click)=\"openModal()\" class=\"hidden md:flex bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase shadow-sm dark:shadow-none hover:bg-black dark:hover:bg-slate-600 transition items-center gap-2\">\r\n                        <i class=\"fa-solid fa-plus\"></i> Th\u00EAm\r\n                    </button>\r\n                </div>\r\n            }\r\n        </div>\r\n\r\n        <!-- LIST CONTENT -->\r\n        @if (activeTab() === 'list') {\r\n            <div class=\"flex-1 overflow-y-auto px-0 py-0 custom-scrollbar relative bg-slate-50/50 dark:bg-slate-900/20\">\r\n                \r\n                <!-- MOBILE CARD VIEW -->\r\n                <div class=\"md:hidden p-4 space-y-3 pb-24\">\r\n                    @if(isInitialLoading()) {\r\n                        @for(i of [1,2,3,4]; track i) {\r\n                            <div class=\"bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700 space-y-3\">\r\n                                <div class=\"flex items-center gap-3\">\r\n                                    <app-skeleton width=\"40px\" height=\"40px\" shape=\"rect\"></app-skeleton>\r\n                                    <div class=\"flex-1 space-y-1\">\r\n                                        <app-skeleton width=\"70%\" height=\"16px\"></app-skeleton>\r\n                                        <app-skeleton width=\"40%\" height=\"12px\"></app-skeleton>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        }\r\n                    } @else {\r\n                        @for (item of items(); track item.id) {\r\n                            <div (click)=\"openModal(item)\" class=\"bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700 active:scale-98 transition-transform\">\r\n                                <div class=\"flex justify-between items-start mb-2\">\r\n                                    <div class=\"flex items-center gap-3\">\r\n                                        <div class=\"w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm dark:shadow-none shrink-0\" [class]=\"getIconGradient(item)\">\r\n                                            <i class=\"fa-solid\" [class]=\"getIcon(item.category)\"></i>\r\n                                        </div>\r\n                                        <div>\r\n                                            <h6 class=\"font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight line-clamp-2\">{{item.name}}</h6>\r\n                                            <span class=\"text-[10px] text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-900/50 px-1.5 rounded border border-slate-100 dark:border-slate-700/50\">{{item.id}}</span>\r\n                                            @if(item.ghsWarnings && item.ghsWarnings.length > 0) {\r\n                                                <div class=\"flex gap-1 mt-1\">\r\n                                                    @for(ghs of item.ghsWarnings; track ghs) {\r\n                                                        @if(GHS_DICT[ghs]) {\r\n                                                            <img [src]=\"GHS_DICT[ghs].iconUrl\" class=\"w-4 h-4 opacity-70\" [title]=\"GHS_DICT[ghs].label\" />\r\n                                                        }\r\n                                                    }\r\n                                                </div>\r\n                                            }\r\n                                        </div>\r\n                                    </div>\r\n                                    @if(item.stock <= (item.threshold || 5)) {\r\n                                        <i class=\"fa-solid fa-circle-exclamation text-orange-500 dark:text-orange-400 animate-pulse\"></i>\r\n                                    }\r\n                                </div>\r\n                                \r\n                                <div class=\"flex flex-col gap-3 border-t border-slate-50 dark:border-slate-700/50 pt-3 mt-1\">\r\n                                    <div class=\"flex items-end justify-between\">\r\n                                        <div>\r\n                                            <div class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase\">T\u1ED3n kho</div>\r\n                                            <div class=\"text-lg font-black text-slate-700 dark:text-slate-200 leading-none\" [class.text-red-500]=\"item.stock <= 0\" [class.dark:text-red-400]=\"item.stock <= 0\">\r\n                                                {{formatNum(item.stock)}} <span class=\"text-xs font-bold text-slate-400 dark:text-slate-500\">{{item.unit}}</span>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"flex gap-2\">\r\n                                            <span class=\"text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-1 rounded\">{{state.categoriesMap().get(item.category || '') || item.category}}</span>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div [appLockPermission]=\"'inventory_edit'\" class=\"flex items-center justify-end\" (click)=\"$event.stopPropagation()\">\r\n                                        <div class=\"flex items-center gap-2\">\r\n                                            <input #quickInputMobile type=\"text\" inputmode=\"text\" [disabled]=\"isProcessing()\" class=\"w-24 px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg text-center focus:border-fuchsia-500 dark:focus:border-fuchsia-500 outline-none font-bold text-slate-700 dark:text-slate-300 font-mono bg-slate-50 dark:bg-slate-900/50\" [placeholder]=\"'+/- (' + item.unit + ')'\" (keyup.enter)=\"quickUpdate(item, quickInputMobile.value); quickInputMobile.value=''\">\r\n                                            <button (click)=\"quickUpdate(item, quickInputMobile.value); quickInputMobile.value=''\" class=\"h-8 px-3 flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm dark:shadow-none text-[11px] font-bold gap-1.5\"><i class=\"fa-solid fa-bolt\"></i> Nhanh</button>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        } @empty {\r\n                            <div class=\"text-center py-10 text-slate-400 dark:text-slate-500 italic\">Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u.</div>\r\n                        }\r\n                        \r\n                        @if (hasMore()) {\r\n                            <button (click)=\"loadMore()\" class=\"w-full py-3 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm dark:shadow-none\">Xem Th\u00EAm...</button>\r\n                        }\r\n                    }\r\n                </div>\r\n\r\n                <!-- DESKTOP TABLE VIEW -->\r\n                <table class=\"hidden md:table w-full text-left border-collapse align-middle relative\">\r\n                    <thead class=\"text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm dark:shadow-none\">\r\n                        <tr>\r\n                            <th class=\"px-4 py-2 pl-6 w-[40%]\">H\u00F3a ch\u1EA5t v\u00E0 v\u1EADt t\u01B0</th>\r\n                            <th class=\"px-4 py-2 border-l border-slate-100 dark:border-slate-700/50\">Ph\u00E2n lo\u1EA1i</th>\r\n                            <th class=\"px-4 py-2 text-center border-l border-slate-100 dark:border-slate-700/50 w-20\">\u0110VT (G\u1ED1c)</th>\r\n                            <th class=\"px-4 py-2 text-right border-l border-slate-100 dark:border-slate-700/50 w-32\">T\u1ED3n kho (Gauge)</th>\r\n                            <th *appHasPermission=\"'inventory_edit'\" class=\"px-4 py-2 text-right border-l border-slate-100 dark:border-slate-700/50 w-32\">Nh\u1EADp nhanh</th>\r\n                            <th class=\"px-4 py-2 text-center w-12 border-l border-slate-100 dark:border-slate-700/50\"></th>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody class=\"text-sm text-slate-600 dark:text-slate-400\">\r\n                        @for (item of items(); track item.id) {\r\n                            <tr class=\"bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition group cursor-pointer border-b border-slate-50 dark:border-slate-700/50\" (click)=\"openModal(item)\">\r\n                                <td class=\"px-4 py-2 pl-6\">\r\n                                    <div class=\"flex items-center gap-3\">\r\n                                        <div class=\"w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm dark:shadow-none shrink-0\" [class]=\"getIconGradient(item)\">\r\n                                            <i class=\"fa-solid text-xs\" [class]=\"getIcon(item.category)\"></i>\r\n                                        </div>\r\n                                        <div class=\"flex flex-col min-w-0 flex-1\">\r\n                                            <h6 class=\"mb-0 text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight truncate\">{{item.name || item.id}}</h6>\r\n                                            <div class=\"flex items-center gap-2 mt-0.5\">\r\n                                                <span class=\"text-[9px] text-slate-400 dark:text-slate-500 font-mono\">{{item.id}}</span>\r\n                                                @if(item.ghsWarnings && item.ghsWarnings.length > 0) {\r\n                                                    <div class=\"flex gap-0.5 opacity-60\">\r\n                                                        @for(ghs of item.ghsWarnings; track ghs) {\r\n                                                            @if(GHS_DICT[ghs]) {\r\n                                                                <img [src]=\"GHS_DICT[ghs].iconUrl\" class=\"w-[14px] h-[14px]\" [title]=\"GHS_DICT[ghs].label\" />\r\n                                                            }\r\n                                                        }\r\n                                                    </div>\r\n                                                }\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </td>\r\n                                <td class=\"px-4 py-2 border-l border-slate-50 dark:border-slate-700/50\"><span class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded\">{{state.categoriesMap().get(item.category || '') || item.category}}</span></td>\r\n                                <td class=\"px-4 py-2 text-center border-l border-slate-50 dark:border-slate-700/50\"><span class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400\">{{item.unit}}</span></td>\r\n                                <td class=\"px-4 py-2 text-right border-l border-slate-50 dark:border-slate-700/50\">\r\n                                    <div class=\"flex flex-col items-end w-full\">\r\n                                        <span class=\"font-mono font-bold text-sm tracking-tight\" [class.text-red-600]=\"item.stock <= 0\" [class.dark:text-red-400]=\"item.stock <= 0\" [innerHTML]=\"formatSmartUnit(item.stock, item.unit)\"></span>\r\n                                        @let percent = getStockPercent(item);\r\n                                        <div class=\"w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden\">\r\n                                            <div class=\"h-full rounded-full\" [style.width.%]=\"percent\" [class.bg-emerald-500]=\"percent > 40\" [class.bg-orange-500]=\"percent <= 40 && percent > 10\" [class.bg-red-500]=\"percent <= 10\"></div>\r\n                                        </div>\r\n                                    </div>\r\n                                </td>\r\n                                    <td *appHasPermission=\"'inventory_edit'\" class=\"px-4 py-2 text-right border-l border-slate-50 dark:border-slate-700/50\" (click)=\"$event.stopPropagation()\">\r\n                                        <div class=\"flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition duration-200\">\r\n                                            <input #quickInput type=\"text\" [disabled]=\"isProcessing()\" class=\"w-20 px-1 py-0.5 text-[10px] border border-slate-200 dark:border-slate-600 rounded text-center focus:border-fuchsia-500 dark:focus:border-fuchsia-500 outline-none font-bold text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-800\" [placeholder]=\"'+/- (' + item.unit + ')'\" (keyup.enter)=\"quickUpdate(item, quickInput.value); quickInput.value=''\">\r\n                                            <button (click)=\"quickUpdate(item, quickInput.value); quickInput.value=''\" class=\"w-6 h-6 flex items-center justify-center rounded bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-sm dark:shadow-none\"><i class=\"fa-solid fa-check text-[10px]\"></i></button>\r\n                                        </div>\r\n                                    </td>\r\n                                <td class=\"px-4 py-2 text-center border-l border-slate-50\"><button (click)=\"openModal(item)\" class=\"text-blue-600 hover:text-blue-800 transition px-1\"><i class=\"fa-solid fa-pen text-xs\"></i></button></td>\r\n                            </tr>\r\n                        }\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n        }\r\n\r\n        <!-- CAPACITY TAB -->\r\n        @if (activeTab() === 'capacity') {\r\n            <div class=\"flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden\">\r\n                <div class=\"w-full md:w-72 border-r border-slate-100 dark:border-slate-700/50 overflow-y-auto p-3 bg-slate-50/50 dark:bg-slate-900/20 h-1/3 md:h-full shrink-0\">\r\n                    <h6 class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase pl-1 mb-2 sticky top-0 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm py-1 z-10\">Ch\u1ECDn Quy Tr\u00ECnh</h6>\r\n                    @for (sop of state.sops(); track sop.id) {\r\n                        <div (click)=\"selectedSopForCap.set(sop)\" \r\n                             class=\"p-2.5 rounded-lg mb-1.5 cursor-pointer transition flex items-center gap-3 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm dark:hover:shadow-none active:scale-95 border\"\r\n                             [class]=\"selectedSopForCap()?.id === sop.id ? 'bg-white dark:bg-slate-800 shadow-sm dark:shadow-none border-fuchsia-200 dark:border-fuchsia-500/30 ring-1 ring-fuchsia-100 dark:ring-fuchsia-500/20' : 'border-transparent'\">\r\n                            <div>\r\n                                <div class=\"text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase\">{{state.categoriesMap().get(sop.category || '') || sop.category}}</div>\r\n                                <div class=\"text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight line-clamp-1\">{{sop.name}}</div>\r\n                            </div>\r\n                        </div>\r\n                    }\r\n                </div>\r\n                <div class=\"flex-1 p-4 md:p-6 overflow-y-auto bg-white dark:bg-slate-800 h-2/3 md:h-full relative pb-24 md:pb-6\">\r\n                    @if(capacityLoading()) {\r\n                        <div class=\"absolute inset-0 bg-white/80 dark:bg-slate-800/80 z-20 flex items-center justify-center flex-col\">\r\n                            <i class=\"fa-solid fa-spinner fa-spin text-2xl text-fuchsia-500 dark:text-fuchsia-400 mb-2\"></i>\r\n                            <span class=\"text-xs font-bold text-slate-500 dark:text-slate-400\">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u kho...</span>\r\n                        </div>\r\n                    }\r\n\r\n                    @if(selectedSopForCap(); as sop) {\r\n                        <div class=\"flex flex-col md:flex-row justify-between items-start mb-4 gap-4\">\r\n                            <div>\r\n                                <h4 class=\"font-bold text-slate-800 dark:text-slate-100 text-lg\">{{sop.name}}</h4>\r\n                                <div class=\"flex gap-2 mt-1\">\r\n                                    <button (click)=\"capacityMode.set('marginal')\" class=\"px-2 py-1 text-[10px] font-bold rounded border transition active:scale-95\" [class]=\"capacityMode() === 'marginal' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/50' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'\">M\u1ED9t M\u1EABu</button>\r\n                                    <button (click)=\"capacityMode.set('standard')\" class=\"px-2 py-1 text-[10px] font-bold rounded border transition active:scale-95\" [class]=\"capacityMode() === 'standard' ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/50' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'\">M\u1EBB Ti\u00EAu Chu\u1EA9n</button>\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"text-right bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50 w-full md:w-auto flex justify-between md:block items-center\">\r\n                                <div class=\"text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase\">N\u0103ng l\u1EF1c t\u1ED1i \u0111a</div>\r\n                                <div class=\"text-xl md:text-2xl font-black text-fuchsia-600 dark:text-fuchsia-400\">{{(capacityResult()?.maxBatches || 0)}} <span class=\"text-xs text-slate-400 dark:text-slate-500 font-normal\">m\u1EBB</span></div>\r\n                            </div>\r\n                        </div>\r\n                        \r\n                        @if (capacityResult()?.limitingFactor) {\r\n                           <div class=\"mb-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg p-3 flex items-start gap-2\">\r\n                              <i class=\"fa-solid fa-triangle-exclamation text-orange-500 dark:text-orange-400 mt-0.5 text-xs\"></i>\r\n                              <div>\r\n                                 <div class=\"text-[10px] font-bold text-orange-800 dark:text-orange-500 uppercase\">Bottleneck</div>\r\n                                 <p class=\"text-xs text-orange-700 dark:text-orange-400 mt-0.5\">Gi\u1EDBi h\u1EA1n b\u1EDFi <b class=\"dark:text-orange-300\">{{resolveCapacityName(capacityResult()?.limitingFactor || '')}}</b>.</p>\r\n                              </div>\r\n                           </div>\r\n                        }\r\n\r\n                        <div class=\"border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-none\">\r\n                           <table class=\"w-full text-xs text-left\">\r\n                              <thead class=\"bg-slate-50 dark:bg-slate-900/50 text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold\">\r\n                                 <tr>\r\n                                    <th class=\"px-4 py-2 border-b border-slate-100 dark:border-slate-700/50\">H\u00F3a ch\u1EA5t</th>\r\n                                    <th class=\"px-4 py-2 text-right border-b border-slate-100 dark:border-slate-700/50\">T\u1ED3n kho</th>\r\n                                    <th class=\"px-4 py-2 text-right border-b border-slate-100 dark:border-slate-700/50\">C\u1EA7n / M\u1EBB</th>\r\n                                    <th class=\"px-4 py-2 text-center border-b border-slate-100 dark:border-slate-700/50\">M\u1EBB</th>\r\n                                 </tr>\r\n                              </thead>\r\n                              <tbody class=\"divide-y divide-slate-50 dark:divide-slate-700/50\">\r\n                                 @for (row of capacityResult()?.details; track row.name) {\r\n                                    <tr class=\"hover:bg-slate-50 dark:hover:bg-slate-700/30 transition\">\r\n                                       <td class=\"px-4 py-2 font-bold text-slate-700 dark:text-slate-300 border-r border-slate-50/50 dark:border-slate-700/30\">{{resolveCapacityName(row.name)}}</td>\r\n                                       <td class=\"px-4 py-2 text-right text-slate-500 dark:text-slate-400 font-mono border-r border-slate-50/50 dark:border-slate-700/30\">{{formatNum(row.stock)}}</td>\r\n                                       <td class=\"px-4 py-2 text-right text-slate-500 dark:text-slate-400 font-mono border-r border-slate-50/50 dark:border-slate-700/30\">{{formatNum(row.need)}}</td>\r\n                                       <td class=\"px-4 py-2 text-center font-bold font-mono dark:text-slate-300\" [class.text-red-500]=\"row.batches === (capacityResult()?.maxBatches ?? 0)\" [class.dark:text-red-400]=\"row.batches === (capacityResult()?.maxBatches ?? 0)\">{{formatNum(row.batches)}}</td>\r\n                                    </tr>\r\n                                 }\r\n                              </tbody>\r\n                           </table>\r\n                        </div>\r\n                    } @else {\r\n                        <div class=\"h-full flex items-center justify-center text-slate-300 dark:text-slate-600 flex-col\"><i class=\"fa-solid fa-chart-pie text-4xl mb-2\"></i><span class=\"text-xs font-bold\">Ch\u1ECDn quy tr\u00ECnh</span></div>\r\n                    }\r\n                </div>\r\n            </div>\r\n        }\r\n\r\n        <!-- LABELS TAB -->\r\n        @if (activeTab() === 'labels') {\r\n            <div class=\"flex-1 min-h-0 w-full flex flex-col\">\r\n                <app-label-print class=\"flex-1 min-h-0 w-full block\"></app-label-print>\r\n            </div>\r\n        }\r\n      </div>\r\n\r\n      <!-- MOBILE FAB (ADD BUTTON) -->\r\n      @if (activeTab() === 'list') {\r\n          <button [appLockPermission]=\"'inventory_edit'\" (click)=\"openModal()\" class=\"md:hidden fixed bottom-20 right-4 w-14 h-14 bg-slate-900 dark:bg-slate-700 text-white rounded-full shadow-lg shadow-slate-400 dark:shadow-none flex items-center justify-center z-30 transition-transform active:scale-90 animate-bounce-in\">\r\n              <i class=\"fa-solid fa-plus text-xl\"></i>\r\n          </button>\r\n      }\r\n\r\n      <!-- MODAL (Responsive Bottom Sheet) -->\r\n      @if (showModal()) {\r\n         @defer {\r\n            <div class=\"fixed inset-0 z-[99] flex items-end md:items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm fade-in\" (click)=\"closeModal()\">\r\n                <!-- Dynamic classes for Bottom Sheet on Mobile vs Center Modal on Desktop -->\r\n                <div class=\"bg-white dark:bg-slate-800 w-full md:max-w-2xl overflow-hidden flex flex-col animate-slide-up shadow-2xl dark:shadow-none\r\n                            rounded-t-2xl md:rounded-2xl \r\n                            h-[85vh] md:h-auto md:max-h-[90vh]\" \r\n                     (click)=\"$event.stopPropagation()\">\r\n                   \r\n                   <div class=\"p-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center shrink-0\">\r\n                      <div>\r\n                          <h5 class=\"font-bold text-slate-800 dark:text-slate-100 text-base\">{{ isEditing() ? 'C\u1EADp nh\u1EADt' : 'Th\u00EAm m\u1EDBi' }}</h5>\r\n                          <p class=\"text-[10px] text-slate-400 dark:text-slate-500\">Th\u00F4ng tin chi ti\u1EBFt h\u00F3a ch\u1EA5t</p>\r\n                      </div>\r\n                      <button (click)=\"closeModal()\" class=\"w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 transition active:scale-90\"><i class=\"fa-solid fa-times\"></i></button>\r\n                   </div>\r\n                   \r\n                   <div class=\"flex-1 overflow-y-auto p-5 md:p-6 bg-slate-50 dark:bg-slate-900/50 custom-scrollbar\">\r\n                       <form [formGroup]=\"form\" (ngSubmit)=\"save()\" class=\"space-y-4\">\r\n                           <!-- Form Controls -->\r\n                           <div>\r\n                               <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">T\u00EAn h\u00F3a ch\u1EA5t</label>\r\n                               <input formControlName=\"name\" (input)=\"onNameChange($event)\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:border-fuchsia-500 dark:focus:border-fuchsia-500 outline-none transition shadow-sm dark:shadow-none font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800\" placeholder=\"Nh\u1EADp t\u00EAn h\u00F3a ch\u1EA5t...\">\r\n                           </div>\r\n                           \r\n                           <div class=\"grid grid-cols-2 gap-4\">\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">M\u00E3 \u0111\u1ECBnh danh</label>\r\n                                   <input formControlName=\"id\" [readonly]=\"isEditing()\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-600 dark:text-slate-400 outline-none shadow-sm dark:shadow-none bg-slate-100 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-800 transition\" placeholder=\"auto-gen\">\r\n                               </div>\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">Ph\u00E2n lo\u1EA1i</label>\r\n                                   <!-- Updated Category Dropdown in Modal -->\r\n                                   <select formControlName=\"category\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer h-[38px]\">\r\n                                       <option value=\"\" disabled>Ch\u1ECDn ph\u00E2n lo\u1EA1i</option>\r\n                                       @for(cat of state.categories(); track cat.id) {\r\n                                           <option [value]=\"cat.id\">{{cat.name}} ({{cat.id}})</option>\r\n                                       }\r\n                                   </select>\r\n                               </div>\r\n                           </div>\r\n\r\n                           <!-- English Name & CAS -->\r\n                           <div class=\"grid grid-cols-2 gap-4\">\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">T\u00EAn ti\u1EBFng Anh</label>\r\n                                   <input formControlName=\"englishName\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none\" placeholder=\"VD: Methanol\">\r\n                               </div>\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">S\u1ED1 CAS</label>\r\n                                   <input formControlName=\"casNumber\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm dark:shadow-none\" placeholder=\"VD: 67-56-1\">\r\n                               </div>\r\n                           </div>\r\n                           \r\n                           <!-- GHS PubChem Auto-fetch -->\r\n                           <div class=\"bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/30 space-y-3\">\r\n                               <div class=\"flex justify-between items-center\">\r\n                                   <label class=\"text-[10px] font-bold text-yellow-800 dark:text-yellow-500 uppercase flex items-center gap-2\">\r\n                                       <i class=\"fa-solid fa-shield-virus\"></i> C\u1EA3nh b\u00E1o H\u00F3a h\u1ECDc\r\n                                   </label>\r\n                                   <button type=\"button\" (click)=\"fetchPubChem()\" [disabled]=\"isFetchingGhs()\" class=\"text-[10px] bg-yellow-400 dark:bg-yellow-600/50 hover:bg-yellow-500 text-yellow-900 dark:text-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-500 dark:border-none font-bold transition flex items-center gap-1 active:scale-95 disabled:opacity-50\">\r\n                                       @if(isFetchingGhs()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> Tra c\u1EE9u... } \r\n                                       @else { <i class=\"fa-solid fa-bolt text-red-600 dark:text-red-400\"></i> T\u1EF1 \u0111\u1ED9ng tra GHS }\r\n                                   </button>\r\n                               </div>\r\n                               \r\n                               <div class=\"grid grid-cols-3 sm:grid-cols-5 gap-2\">\r\n                                   @for(code of ghsKeys; track code) {\r\n                                       <div (click)=\"toggleGhs(code)\" \r\n                                            class=\"cursor-pointer border rounded-lg p-1.5 flex flex-col items-center text-center transition active:scale-95 bg-white dark:bg-slate-800 opacity-60 hover:opacity-100\"\r\n                                            [class]=\"form.get('ghsWarnings')?.value?.includes(code) ? '!border-red-500 ring-1 ring-red-200 dark:ring-red-900/50 !opacity-100 shadow-sm bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'\">\r\n                                           <img [src]=\"GHS_DICT[code].iconUrl\" class=\"w-8 h-8 sm:w-10 sm:h-10 mb-1\" [alt]=\"code\" />\r\n                                           <span class=\"text-[8px] font-bold text-slate-600 dark:text-slate-400 leading-tight w-full truncate\" [title]=\"GHS_DICT[code].label\">{{GHS_DICT[code].label}}</span>\r\n                                       </div>\r\n                                   }\r\n                               </div>\r\n                               \r\n                               @if(form.get('hazardStatements')?.value?.length || form.get('precautionaryStatements')?.value?.length) {\r\n                                   <div class=\"mt-3 space-y-2 max-h-40 overflow-y-auto custom-scrollbar text-[10px] p-2 bg-white dark:bg-slate-800 rounded border border-yellow-200 dark:border-yellow-800/30\">\r\n                                       @if(form.get('hazardStatements')?.value?.length) {\r\n                                           <div>\r\n                                               <strong class=\"text-red-600 dark:text-red-400\">C\u1EA3nh b\u00E1o Nguy hi\u1EC3m (H):</strong>\r\n                                               <ul class=\"list-disc pl-4 text-slate-600 dark:text-slate-400 mt-1\">\r\n                                                   @for(h of form.get('hazardStatements')?.value; track h) { <li>{{h}}</li> }\r\n                                               </ul>\r\n                                           </div>\r\n                                       }\r\n                                       @if(form.get('precautionaryStatements')?.value?.length) {\r\n                                           <div class=\"mt-2 text-blue-600 dark:text-blue-400\">\r\n                                               <strong>Ph\u00F2ng ng\u1EEBa (P):</strong>\r\n                                               <ul class=\"list-disc pl-4 text-slate-600 dark:text-slate-400 mt-1\">\r\n                                                   @for(p of form.get('precautionaryStatements')?.value; track p) { <li>{{p}}</li> }\r\n                                               </ul>\r\n                                           </div>\r\n                                       }\r\n                                   </div>\r\n                               }\r\n                           </div>\r\n\r\n                           <div class=\"grid grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-none\">\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">T\u1ED3n kho</label>\r\n                                   <input type=\"number\" formControlName=\"stock\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400 outline-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 transition text-center\">\r\n                               </div>\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">\u0110\u01A1n v\u1ECB (G\u1ED1c)</label>\r\n                                   <select formControlName=\"unit\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-200 transition h-[48px]\">\r\n                                       @for (opt of unitOptions; track opt.value) { <option [value]=\"opt.value\">{{opt.label}}</option> }\r\n                                   </select>\r\n                               </div>\r\n                           </div>\r\n                           \r\n                           <div class=\"grid grid-cols-2 gap-4\">\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">V\u1ECB tr\u00ED</label>\r\n                                   <input formControlName=\"location\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200\" placeholder=\"VD: T\u1EE7 A\">\r\n                               </div>\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1 block mb-1\">Ng\u01B0\u1EE1ng b\u00E1o \u0111\u1ED9ng</label>\r\n                                   <input type=\"number\" formControlName=\"threshold\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 font-bold text-orange-500 dark:text-orange-400\" placeholder=\"5\">\r\n                               </div>\r\n                           </div>\r\n                           \r\n                           <!-- GS1 Data Fields -->\r\n                           <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30\">\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase ml-1 block mb-1\">GTIN (m\u00E3 s\u1EA3n ph\u1EA9m)</label>\r\n                                   <input formControlName=\"gtin\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200\" placeholder=\"VD: 04059081234567\">\r\n                               </div>\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase ml-1 block mb-1\">S\u1ED1 L\u00F4 (Lot/Batch)</label>\r\n                                   <input formControlName=\"lotNumber\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200\" placeholder=\"VD: A12345678\">\r\n                               </div>\r\n                               <div>\r\n                                   <label class=\"text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase ml-1 block mb-1\">H\u1EA1n s\u1EED d\u1EE5ng</label>\r\n                                   <input type=\"date\" formControlName=\"expiryDate\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs outline-none shadow-sm dark:shadow-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200\">\r\n                               </div>\r\n                           </div>\r\n                           \r\n                           <div class=\"pt-2 border-t border-slate-200 dark:border-slate-700/50\">\r\n                               <label class=\"text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase ml-1 block mb-1\">L\u00FD do thay \u0111\u1ED5i <span class=\"text-red-500 dark:text-red-400\">*</span></label>\r\n                               <input formControlName=\"reason\" class=\"w-full border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-xs outline-none shadow-sm dark:shadow-none bg-yellow-50 dark:bg-yellow-900/20 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-200 transition placeholder-slate-400 dark:placeholder-slate-500\" placeholder=\"VD: Nh\u1EADp kho, Ki\u1EC3m k\u00EA, V\u1EE1 h\u1ECFng...\" required>\r\n                           </div>\r\n\r\n                           <div class=\"pt-4 flex gap-3 pb-safe\">\r\n                               @if(isEditing()) {\r\n                                   <button type=\"button\" (click)=\"deleteItem($any(form.getRawValue()))\" [disabled]=\"isProcessing()\" class=\"flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-3.5 rounded-xl font-bold text-xs shadow-sm dark:shadow-none hover:bg-red-100 dark:hover:bg-red-900/40 transition active:scale-95 disabled:opacity-50\">\r\n                                       @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> } @else { X\u00F3a }\r\n                                   </button>\r\n                               }\r\n                               <button type=\"submit\" [disabled]=\"isProcessing()\" class=\"flex-[3] bg-slate-800 dark:bg-slate-700 text-white py-3.5 rounded-xl font-bold text-xs shadow-md dark:shadow-none hover:shadow-lg hover:bg-black dark:hover:bg-slate-600 transition transform active:scale-95 disabled:opacity-50\">\r\n                                   @if(isProcessing()) { <i class=\"fa-solid fa-spinner fa-spin\"></i> \u0110ang l\u01B0u... } \r\n                                   @else { {{ isEditing() ? 'L\u01B0u thay \u0111\u1ED5i' : 'T\u1EA1o m\u1EDBi' }} }\r\n                               </button>\r\n                           </div>\r\n                       </form>\r\n                   </div>\r\n                </div>\r\n            </div>\r\n         }\r\n      }\r\n    </div>\r\n", styles: ["\n    @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }\n    .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }\n    .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }\n  "] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(InventoryComponent, { className: "InventoryComponent", filePath: "src/app/features/inventory/inventory.component.ts", lineNumber: 37 }); })();
//# sourceMappingURL=inventory.component.js.map