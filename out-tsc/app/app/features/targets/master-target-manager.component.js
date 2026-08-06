import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MasterTargetService } from './master-target.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { generateSlug } from '../../shared/utils/utils';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function MasterTargetManagerComponent_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27);
    i0.ɵɵelement(1, "i", 32);
    i0.ɵɵelementEnd();
} }
function MasterTargetManagerComponent_Conditional_36_For_13_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 42);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("title", item_r4.aliases.join(", "));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" Alias: ", item_r4.aliases.join(", "), " ");
} }
function MasterTargetManagerComponent_Conditional_36_For_13_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 44)(1, "span", 53);
    i0.ɵɵtext(2, "CAS:");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", item_r4.cas_number, "");
} }
function MasterTargetManagerComponent_Conditional_36_For_13_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 44)(1, "span", 53);
    i0.ɵɵtext(2, "CT:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 54);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(item_r4.chemical_formula);
} }
function MasterTargetManagerComponent_Conditional_36_For_13_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 38)(1, "td", 39)(2, "div", 40);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 41);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, MasterTargetManagerComponent_Conditional_36_For_13_Conditional_6_Template, 2, 2, "div", 42);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 39)(8, "div", 43);
    i0.ɵɵtemplate(9, MasterTargetManagerComponent_Conditional_36_For_13_Conditional_9_Template, 4, 1, "span", 44)(10, MasterTargetManagerComponent_Conditional_36_For_13_Conditional_10_Template, 5, 1, "span", 44);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "td", 45)(12, "span", 46);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "td", 47)(15, "div", 48)(16, "button", 49);
    i0.ɵɵlistener("click", function MasterTargetManagerComponent_Conditional_36_For_13_Template_button_click_16_listener() { const item_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r4 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r4.openModal(item_r4)); });
    i0.ɵɵelement(17, "i", 50);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 51);
    i0.ɵɵlistener("click", function MasterTargetManagerComponent_Conditional_36_For_13_Template_button_click_18_listener() { const item_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r4 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r4.deleteItem(item_r4)); });
    i0.ɵɵelement(19, "i", 52);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const item_r4 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r4.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵconditional((item_r4.aliases == null ? null : item_r4.aliases.length) ? 6 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(item_r4.cas_number ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r4.chemical_formula ? 10 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r4.default_unit || "-");
} }
function MasterTargetManagerComponent_Conditional_36_ForEmpty_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 55);
    i0.ɵɵtext(2, "Kh\u00F4ng t\u00ECm th\u1EA5y d\u1EEF li\u1EC7u ph\u00F9 h\u1EE3p.");
    i0.ɵɵelementEnd()();
} }
function MasterTargetManagerComponent_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "table", 28)(1, "thead", 33)(2, "tr")(3, "th", 34);
    i0.ɵɵtext(4, "T\u00EAn ch\u1EC9 ti\u00EAu / ID");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "th", 34);
    i0.ɵɵtext(6, "Th\u00F4ng tin h\u00F3a h\u1ECDc");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "th", 35);
    i0.ɵɵtext(8, "\u0110\u01A1n v\u1ECB Chu\u1EA9n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "th", 36);
    i0.ɵɵtext(10, "T\u00E1c v\u1EE5");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "tbody", 37);
    i0.ɵɵrepeaterCreate(12, MasterTargetManagerComponent_Conditional_36_For_13_Template, 20, 6, "tr", 38, _forTrack0, false, MasterTargetManagerComponent_Conditional_36_ForEmpty_14_Template, 3, 0, "tr");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(12);
    i0.ɵɵrepeater(ctx_r4.filteredItems());
} }
function MasterTargetManagerComponent_Conditional_39_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 56)(2, "div", 57)(3, "h3", 58);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 59);
    i0.ɵɵlistener("click", function MasterTargetManagerComponent_Conditional_39_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r6); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.closeModal()); });
    i0.ɵɵelement(6, "i", 60);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 61)(8, "form", 62);
    i0.ɵɵlistener("ngSubmit", function MasterTargetManagerComponent_Conditional_39_Template_form_ngSubmit_8_listener() { i0.ɵɵrestoreView(_r6); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.save()); });
    i0.ɵɵelementStart(9, "div")(10, "label", 63);
    i0.ɵɵtext(11, "T\u00EAn ch\u1EC9 ti\u00EAu ");
    i0.ɵɵelementStart(12, "span", 64);
    i0.ɵɵtext(13, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "input", 65);
    i0.ɵɵlistener("input", function MasterTargetManagerComponent_Conditional_39_Template_input_input_14_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.onNameChange($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div")(16, "label", 63);
    i0.ɵɵtext(17, "M\u00E3 \u0111\u1ECBnh danh (t\u1EF1 t\u1EA1o)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "input", 66);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "div", 67)(20, "div")(21, "label", 63);
    i0.ɵɵtext(22, "S\u1ED1 CAS");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(23, "input", 68);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "div")(25, "label", 63);
    i0.ɵɵtext(26, "\u0110\u01A1n v\u1ECB m\u1EB7c \u0111\u1ECBnh");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(27, "input", 69);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "div")(29, "label", 63);
    i0.ɵɵtext(30, "C\u00F4ng th\u1EE9c h\u00F3a h\u1ECDc");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "input", 70);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div")(33, "label", 63);
    i0.ɵɵtext(34, "T\u00EAn kh\u00E1c / Alias khi import");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(35, "textarea", 71);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div")(37, "label", 63);
    i0.ɵɵtext(38, "M\u00F4 t\u1EA3 / Ghi ch\u00FA");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(39, "textarea", 72);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(40, "div", 73)(41, "button", 74);
    i0.ɵɵlistener("click", function MasterTargetManagerComponent_Conditional_39_Template_button_click_41_listener() { i0.ɵɵrestoreView(_r6); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.closeModal()); });
    i0.ɵɵtext(42, "H\u1EE7y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "button", 75);
    i0.ɵɵtext(44);
    i0.ɵɵelementEnd()()()()()();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r4.isEditing() ? "C\u1EADp nh\u1EADt ch\u1EC9 ti\u00EAu" : "Th\u00EAm ch\u1EC9 ti\u00EAu m\u1EDBi", " ");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r4.form);
    i0.ɵɵadvance(35);
    i0.ɵɵproperty("disabled", ctx_r4.form.invalid || ctx_r4.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r4.isEditing() ? "L\u01B0u thay \u0111\u1ED5i" : "T\u1EA1o m\u1EDBi", " ");
} }
function MasterTargetManagerComponent_Conditional_40_For_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 86)(1, "td", 90);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "td", 91);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "td", 92);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "td", 93);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "td", 94);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "td", 95);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r8 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r8.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r8.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r8.cas_number || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r8.chemical_formula || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate((item_r8.aliases == null ? null : item_r8.aliases.join(", ")) || "-");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r8.default_unit || "-");
} }
function MasterTargetManagerComponent_Conditional_40_Conditional_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 96);
    i0.ɵɵtext(1, " \u0110ang l\u01B0u... ");
} }
function MasterTargetManagerComponent_Conditional_40_Conditional_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 97);
    i0.ɵɵtext(1, " X\u00E1c nh\u1EADn Import ");
} }
function MasterTargetManagerComponent_Conditional_40_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 31)(1, "div", 76)(2, "div", 57)(3, "h3", 77);
    i0.ɵɵelement(4, "i", 78);
    i0.ɵɵtext(5, " Xem Tr\u01B0\u1EDBc Import ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 59);
    i0.ɵɵlistener("click", function MasterTargetManagerComponent_Conditional_40_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r7); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.cancelImport()); });
    i0.ɵɵelement(7, "i", 60);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 79);
    i0.ɵɵelement(9, "i", 80);
    i0.ɵɵelementStart(10, "div");
    i0.ɵɵtext(11, " Ki\u1EC3m tra d\u1EEF li\u1EC7u b\u00EAn d\u01B0\u1EDBi. C\u00E1c d\u00F2ng c\u00F3 ");
    i0.ɵɵelementStart(12, "b");
    i0.ɵɵtext(13, "ID");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14, " tr\u00F9ng s\u1EBD b\u1ECB ghi \u0111\u00E8. ");
    i0.ɵɵelement(15, "br");
    i0.ɵɵtext(16, "T\u1ED5ng c\u1ED9ng: ");
    i0.ɵɵelementStart(17, "b");
    i0.ɵɵtext(18);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(19, " ch\u1EC9 ti\u00EAu h\u1EE3p l\u1EC7. ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(20, "div", 81)(21, "table", 82)(22, "thead", 83)(23, "tr")(24, "th", 84);
    i0.ɵɵtext(25, "T\u00EAn ch\u1EC9 ti\u00EAu");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "th", 84);
    i0.ɵɵtext(27, "M\u00E3 \u0111\u1ECBnh danh (t\u1EF1 \u0111\u1ED9ng)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "th", 84);
    i0.ɵɵtext(29, "CAS");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(30, "th", 84);
    i0.ɵɵtext(31, "Formula");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "th", 84);
    i0.ɵɵtext(33, "Alias");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "th", 85);
    i0.ɵɵtext(35, "Unit");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(36, "tbody", 37);
    i0.ɵɵrepeaterCreate(37, MasterTargetManagerComponent_Conditional_40_For_38_Template, 13, 6, "tr", 86, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(39, "div", 87)(40, "button", 88);
    i0.ɵɵlistener("click", function MasterTargetManagerComponent_Conditional_40_Template_button_click_40_listener() { i0.ɵɵrestoreView(_r7); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.cancelImport()); });
    i0.ɵɵtext(41, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "button", 89);
    i0.ɵɵlistener("click", function MasterTargetManagerComponent_Conditional_40_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r7); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.confirmImport()); });
    i0.ɵɵtemplate(43, MasterTargetManagerComponent_Conditional_40_Conditional_43_Template, 2, 0)(44, MasterTargetManagerComponent_Conditional_40_Conditional_44_Template, 2, 0);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance(18);
    i0.ɵɵtextInterpolate(ctx_r4.importPreview().length);
    i0.ɵɵadvance(19);
    i0.ɵɵrepeater(ctx_r4.importPreview());
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r4.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r4.isProcessing() ? 43 : 44);
} }
export class MasterTargetManagerComponent {
    constructor() {
        this.masterService = inject(MasterTargetService);
        this.firebase = inject(FirebaseService);
        this.toast = inject(ToastService);
        this.confirmation = inject(ConfirmationService);
        this.router = inject(Router);
        this.fb = inject(FormBuilder); // Explicitly type FormBuilder
        this.items = signal([]);
        this.isLoading = signal(false);
        this.isProcessing = signal(false);
        this.showModal = signal(false);
        this.isEditing = signal(false);
        this.searchTerm = signal('');
        this.editingItem = signal(null);
        // Import State
        this.importPreview = signal([]);
        this.form = this.fb.group({
            id: ['', Validators.required],
            name: ['', Validators.required],
            cas_number: [''],
            chemical_formula: [''],
            default_unit: [''],
            aliasesText: [''],
            description: ['']
        });
        this.filteredItems = computed(() => {
            const term = this.searchTerm().toLowerCase().trim();
            if (!term)
                return this.items();
            return this.items().filter(i => i.name.toLowerCase().includes(term) ||
                i.id.includes(term) ||
                (i.aliases || []).some(alias => alias.toLowerCase().includes(term)) ||
                i.cas_number?.includes(term) ||
                i.chemical_formula?.toLowerCase().includes(term));
        });
    }
    async migrateHyphenToUnderscore() {
        if (!confirm('Are you sure you want to run the full migration replacing hyphens with underscores in IDs? This will modify master_analytes, targetGroups, sops, and requests.'))
            return;
        this.isProcessing.set(true);
        try {
            const { getDocs, collection, writeBatch, doc, serverTimestamp } = await import('firebase/firestore');
            const db = this.firebase.db;
            const appId = this.firebase.APP_ID;
            let batch = writeBatch(db);
            let opCount = 0;
            const commitBatch = async () => {
                if (opCount > 0) {
                    await batch.commit();
                    batch = writeBatch(db);
                    opCount = 0;
                }
            };
            console.log('Đang chuyển đổi danh mục chỉ tiêu...');
            const analytesSnap = await getDocs(collection(db, `artifacts/${appId}/master_analytes`));
            for (const d of analytesSnap.docs) {
                const docId = d.id;
                const data = d.data();
                let changed = false;
                let newDocId = docId;
                if (docId.includes('-')) {
                    newDocId = docId.replace(/-/g, '_');
                    changed = true;
                }
                if (data.id && data.id.includes('-')) {
                    data.id = data.id.replace(/-/g, '_');
                    changed = true;
                }
                if (changed) {
                    data.lastUpdated = serverTimestamp(); // BẮT BUỘC ĐỂ DELTASYNC NHẬN DIỆN THAY ĐỔI
                    if (newDocId !== docId) {
                        batch.set(doc(db, `artifacts/${appId}/master_analytes`, newDocId), {
                            ...data,
                            _isDeleted: false,
                            lastUpdated: serverTimestamp()
                        });
                        batch.set(doc(db, `artifacts/${appId}/master_analytes`, docId), {
                            _isDeleted: true,
                            lastUpdated: serverTimestamp()
                        }, { merge: true });
                        opCount += 2;
                    }
                    else {
                        batch.set(doc(db, `artifacts/${appId}/master_analytes`, docId), data);
                        opCount++;
                    }
                    if (opCount > 400)
                        await commitBatch();
                }
            }
            await commitBatch();
            console.log('Đang chuyển đổi nhóm chỉ tiêu...');
            const tgSnap = await getDocs(collection(db, `artifacts/${appId}/target_groups`));
            for (const d of tgSnap.docs) {
                const data = d.data();
                let changed = false;
                if (data.id && data.id.includes('-')) {
                    data.id = data.id.replace(/-/g, '_');
                    changed = true;
                }
                if (data.targets && Array.isArray(data.targets)) {
                    data.targets.forEach((t) => {
                        if (t.id && t.id.includes('-')) {
                            t.id = t.id.replace(/-/g, '_');
                            changed = true;
                        }
                    });
                }
                if (changed) {
                    data.lastUpdated = serverTimestamp();
                    if (d.id.includes('-')) {
                        const newId = d.id.replace(/-/g, '_');
                        batch.set(doc(db, `artifacts/${appId}/target_groups`, newId), data);
                        batch.delete(doc(db, `artifacts/${appId}/target_groups`, d.id));
                        opCount += 2;
                    }
                    else {
                        batch.set(doc(db, `artifacts/${appId}/target_groups`, d.id), data);
                        opCount++;
                    }
                    if (opCount > 400)
                        await commitBatch();
                }
            }
            await commitBatch();
            console.log('Migrating SOPs...');
            const sopsSnap = await getDocs(collection(db, `artifacts/${appId}/sops`));
            for (const d of sopsSnap.docs) {
                const data = d.data();
                let changed = false;
                if (data.targets && Array.isArray(data.targets)) {
                    data.targets.forEach((t) => {
                        if (t.id && t.id.includes('-')) {
                            t.id = t.id.replace(/-/g, '_');
                            changed = true;
                        }
                    });
                }
                if (changed) {
                    data.lastUpdated = serverTimestamp();
                    batch.set(doc(db, `artifacts/${appId}/sops`, d.id), data);
                    opCount++;
                    if (opCount > 400)
                        await commitBatch();
                }
            }
            await commitBatch();
            console.log('Migrating Requests...');
            const reqsSnap = await getDocs(collection(db, `artifacts/${appId}/requests`));
            for (const d of reqsSnap.docs) {
                const data = d.data();
                let changed = false;
                if (data.targetIds && Array.isArray(data.targetIds)) {
                    const newTargetIds = data.targetIds.map((tid) => tid.includes('-') ? tid.replace(/-/g, '_') : tid);
                    if (JSON.stringify(newTargetIds) !== JSON.stringify(data.targetIds)) {
                        data.targetIds = newTargetIds;
                        changed = true;
                    }
                }
                if (data.tests && Array.isArray(data.tests)) {
                    data.tests.forEach((test) => {
                        if (test.targets && Array.isArray(test.targets)) {
                            test.targets.forEach((t) => {
                                if (t.id && t.id.includes('-')) {
                                    t.id = t.id.replace(/-/g, '_');
                                    changed = true;
                                }
                            });
                        }
                    });
                }
                if (data.sampleTargetMap) {
                    for (const sampleId of Object.keys(data.sampleTargetMap)) {
                        const arr = data.sampleTargetMap[sampleId];
                        if (Array.isArray(arr)) {
                            const newArr = arr.map((id) => id.includes('-') ? id.replace(/-/g, '_') : id);
                            if (JSON.stringify(newArr) !== JSON.stringify(arr)) {
                                data.sampleTargetMap[sampleId] = newArr;
                                changed = true;
                            }
                        }
                        else if (typeof arr === 'object' && arr !== null) {
                            // In case it's a map not an array
                            const tMap = arr;
                            for (const k of Object.keys(tMap)) {
                                if (k.includes('-')) {
                                    const newK = k.replace(/-/g, '_');
                                    tMap[newK] = tMap[k];
                                    delete tMap[k];
                                    changed = true;
                                }
                            }
                        }
                    }
                }
                if (data.analysisResult && data.analysisResult.resultData) {
                    for (const sampleId of Object.keys(data.analysisResult.resultData)) {
                        const rData = data.analysisResult.resultData[sampleId];
                        for (const k of Object.keys(rData)) {
                            if (k.includes('-')) {
                                const newK = k.replace(/-/g, '_');
                                rData[newK] = rData[k];
                                delete rData[k];
                                changed = true;
                            }
                        }
                    }
                }
                if (changed) {
                    data.lastUpdated = serverTimestamp();
                    batch.set(doc(db, `artifacts/${appId}/requests`, d.id), data);
                    opCount++;
                    if (opCount > 400)
                        await commitBatch();
                }
            }
            await commitBatch();
            this.toast.show('Migration completed successfully! Reloading...', 'success');
            // Xóa cache cục bộ để DeltaSync tải lại toàn bộ danh sách mới nhất
            localStorage.removeItem(`delta_master_analytes_${appId}`);
            localStorage.removeItem(`delta_master_analytes_cursor_${appId}`);
            setTimeout(() => window.location.reload(), 1500);
        }
        catch (error) {
            console.error('Migration error:', error);
            this.toast.show('Migration failed: ' + error.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    ngOnInit() {
        this.loadData();
    }
    async loadData() {
        this.isLoading.set(true);
        try {
            const data = await this.masterService.getAll();
            this.items.set(data);
        }
        catch (e) {
            this.toast.show('Lỗi tải dữ liệu', 'error');
        }
        finally {
            this.isLoading.set(false);
        }
    }
    goBack() {
        this.router.navigate(['/config']);
    }
    openModal(item) {
        this.showModal.set(true);
        if (item) {
            this.isEditing.set(true);
            this.editingItem.set(item);
            this.form.patchValue({
                ...item,
                aliasesText: (item.aliases || []).join('\n')
            });
        }
        else {
            this.isEditing.set(false);
            this.editingItem.set(null);
            this.form.reset();
        }
        this.form.controls.id.enable();
    }
    closeModal() {
        this.showModal.set(false);
        this.editingItem.set(null);
    }
    onNameChange(event) {
        if (!this.isEditing()) {
            this.form.patchValue({ id: generateSlug(event.target.value) });
        }
    }
    async save() {
        if (this.form.invalid)
            return;
        this.isProcessing.set(true);
        const val = this.form.getRawValue();
        const item = {
            id: (val.id || '').trim(),
            name: (val.name || '').trim(),
            cas_number: (val.cas_number || '').trim(),
            chemical_formula: (val.chemical_formula || '').trim(),
            default_unit: (val.default_unit || '').trim(),
            aliases: splitAliases(val.aliasesText || ''),
            description: (val.description || '').trim()
        };
        try {
            const oldItem = this.editingItem();
            if (this.isEditing() && oldItem && oldItem.id !== item.id) {
                // ID changed: delete old document first
                await this.masterService.delete(oldItem.id);
            }
            await this.masterService.save(item);
            this.toast.show('Đã lưu thành công', 'success');
            this.closeModal();
            this.loadData();
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async deleteItem(item) {
        if (await this.confirmation.confirm(`Xóa chỉ tiêu gốc "${item.name}"?`)) {
            try {
                await this.masterService.delete(item.id);
                this.toast.show('Đã xóa');
                this.loadData();
            }
            catch (e) {
                this.toast.show('Lỗi: ' + e.message, 'error');
            }
        }
    }
    // --- EXCEL IMPORT LOGIC ---
    async onFileSelected(event) {
        const file = event.target.files[0];
        if (!file)
            return;
        this.isLoading.set(true);
        try {
            const XLSX = await import('xlsx');
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rawData = XLSX.utils.sheet_to_json(firstSheet);
                this.parseImportData(rawData);
                this.isLoading.set(false);
                event.target.value = ''; // Reset input
            };
            reader.readAsArrayBuffer(file);
        }
        catch (e) {
            this.toast.show('Lỗi đọc file: ' + e.message, 'error');
            this.isLoading.set(false);
        }
    }
    parseImportData(data) {
        const parsed = [];
        const normalize = (k) => k.toLowerCase().trim();
        for (const row of data) {
            // Flexible Column Matching
            let name = '';
            let cas = '';
            let formula = '';
            let unit = '';
            let desc = '';
            let aliases = [];
            // Loop through keys to find matches
            Object.keys(row).forEach(key => {
                const k = normalize(key);
                const val = (row[key] || '').toString().trim();
                if (k.includes('alias') || k.includes('bí danh') || k.includes('tên khác'))
                    aliases = splitAliases(val);
                else if (k.includes('name') || k.includes('tên') || k.includes('chất'))
                    name = val;
                else if (k.includes('cas'))
                    cas = val;
                else if (k.includes('formula') || k.includes('công thức') || k.includes('cthh'))
                    formula = val;
                else if (k.includes('unit') || k.includes('đơn vị'))
                    unit = val;
                else if (k.includes('desc') || k.includes('mô tả') || k.includes('note'))
                    desc = val;
            });
            if (name) {
                parsed.push({
                    id: generateSlug(name),
                    name: name,
                    aliases,
                    cas_number: cas,
                    chemical_formula: formula,
                    default_unit: unit || 'ppb',
                    description: desc
                });
            }
        }
        if (parsed.length > 0) {
            this.importPreview.set(parsed);
            this.toast.show(`Tìm thấy ${parsed.length} dòng hợp lệ.`);
        }
        else {
            this.toast.show('Không tìm thấy dữ liệu hợp lệ trong file.', 'info');
        }
    }
    cancelImport() {
        this.importPreview.set([]);
    }
    async confirmImport() {
        const data = this.importPreview();
        if (data.length === 0)
            return;
        this.isProcessing.set(true);
        try {
            await this.masterService.saveBatch(data);
            this.toast.show(`Đã import thành công ${data.length} chỉ tiêu.`, 'success');
            this.importPreview.set([]);
            this.loadData();
        }
        catch (e) {
            this.toast.show('Không thể lưu dữ liệu nhập: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    async exportToExcel() {
        this.isProcessing.set(true);
        try {
            const XLSX = await import('xlsx');
            const dataToExport = this.items().map(item => ({
                'Mã định danh': item.id,
                'Tên chỉ tiêu': item.name,
                'Tên khác / Alias': (item.aliases || []).join('; '),
                'Số CAS': item.cas_number || '',
                'Công thức hóa học': item.chemical_formula || '',
                'Đơn vị mặc định': item.default_unit || 'ppb',
                'Mô tả / Ghi chú': item.description || ''
            }));
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Danh mục chỉ tiêu gốc");
            // Auto-adjust column width
            const maxLens = dataToExport.reduce((acc, row) => {
                Object.keys(row).forEach(key => {
                    const val = row[key]?.toString() || '';
                    acc[key] = Math.max(acc[key] || 10, val.length, key.length);
                });
                return acc;
            }, {});
            ws['!cols'] = Object.keys(maxLens).map(key => ({ wch: maxLens[key] + 3 }));
            const fileName = `LIMS_Master_Analytes.xlsx`;
            XLSX.writeFile(wb, fileName);
            this.toast.show('Xuất tệp Excel thành công!', 'success');
        }
        catch (e) {
            this.toast.show('Lỗi xuất file: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    static { this.ɵfac = function MasterTargetManagerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MasterTargetManagerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MasterTargetManagerComponent, selectors: [["app-master-target-manager"]], decls: 41, vars: 7, consts: [["fileInput", ""], [1, "h-full", "flex", "flex-col", "fade-in", "bg-slate-50", "relative", "pb-10"], [1, "h-16", "bg-white", "border-b", "border-slate-200", "flex", "items-center", "justify-between", "px-6", "shrink-0", "shadow-sm", "z-30"], [1, "flex", "items-center", "gap-4"], [1, "text-slate-500", "hover:text-slate-800", "text-sm", "font-bold", "flex", "items-center", "gap-2", "transition", 3, "click"], [1, "fa-solid", "fa-arrow-left"], [1, "hidden", "md:inline"], [1, "h-6", "w-px", "bg-slate-200"], [1, "text-lg", "font-black", "text-slate-800", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-book-medical", "text-indigo-600"], [1, "text-[10px]", "text-slate-500", "mt-0.5", "font-medium"], [1, "flex", "gap-2"], [1, "px-4", "py-2", "bg-rose-50", "text-rose-700", "hover:bg-rose-100", "border", "border-rose-200", "rounded-lg", "font-bold", "text-xs", "transition", "flex", "items-center", "gap-2", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-wand-magic-sparkles"], [1, "px-4", "py-2", "bg-blue-50", "text-blue-700", "hover:bg-blue-100", "border", "border-blue-200", "rounded-lg", "font-bold", "text-xs", "transition", "flex", "items-center", "gap-2", "active:scale-95", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-file-export"], [1, "px-4", "py-2", "bg-emerald-50", "text-emerald-700", "hover:bg-emerald-100", "border", "border-emerald-200", "rounded-lg", "font-bold", "text-xs", "transition", "flex", "items-center", "gap-2", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-file-excel"], ["type", "file", "accept", ".xlsx, .csv", 1, "hidden", 3, "change"], [1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-md", "transition", "flex", "items-center", "gap-2", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-plus"], [1, "flex-1", "p-6", "overflow-hidden", "flex", "flex-col"], [1, "mb-4", "relative"], [1, "fa-solid", "fa-search", "absolute", "left-4", "top-3.5", "text-slate-400", "text-sm"], ["placeholder", "T\u00ECm ki\u1EBFm t\u00EAn ch\u1EA5t, CAS number, c\u00F4ng th\u1EE9c h\u00F3a h\u1ECDc...", 1, "w-full", "pl-12", "pr-4", "py-3", "border", "border-slate-200", "rounded-xl", "text-sm", "font-bold", "text-slate-700", "outline-none", "focus:border-indigo-500", "focus:ring-4", "focus:ring-indigo-500/10", "transition", "shadow-sm", 3, "ngModelChange", "ngModel"], [1, "flex-1", "bg-white", "rounded-2xl", "shadow-sm", "border", "border-slate-200", "overflow-hidden", "flex", "flex-col"], [1, "overflow-y-auto", "custom-scrollbar", "flex-1", "p-2"], [1, "p-10", "text-center", "text-slate-400"], [1, "w-full", "text-sm", "text-left", "border-collapse"], [1, "p-3", "bg-slate-50", "border-t", "border-slate-200", "text-xs", "font-bold", "text-slate-500", "text-right"], [1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "fa-solid", "fa-spinner", "fa-spin", "text-2xl"], [1, "text-xs", "text-slate-500", "uppercase", "bg-slate-50", "sticky", "top-0", "z-10", "font-bold"], [1, "px-4", "py-3", "border-b", "border-slate-100"], [1, "px-4", "py-3", "border-b", "border-slate-100", "text-center"], [1, "px-4", "py-3", "border-b", "border-slate-100", "text-right"], [1, "divide-y", "divide-slate-100"], [1, "hover:bg-indigo-50/30", "transition", "group"], [1, "px-4", "py-3"], [1, "font-bold", "text-slate-800", "text-sm"], [1, "text-[10px]", "font-mono", "text-slate-400", "bg-slate-100", "px-1.5", "py-0.5", "rounded", "w-fit", "mt-1", "border", "border-slate-200"], [1, "text-[10px]", "text-indigo-500", "mt-1.5", "line-clamp-2", 3, "title"], [1, "flex", "flex-col", "gap-1", "text-xs"], [1, "text-slate-600"], [1, "px-4", "py-3", "text-center"], [1, "inline-block", "px-2", "py-1", "bg-slate-100", "text-slate-600", "rounded", "text-xs", "font-bold"], [1, "px-4", "py-3", "text-right"], [1, "flex", "justify-end", "gap-2", "opacity-0", "group-hover:opacity-100", "transition-opacity"], [1, "w-8", "h-8", "rounded-lg", "bg-white", "border", "border-slate-200", "text-blue-600", "hover:bg-blue-50", "transition", "shadow-sm", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-pen"], [1, "w-8", "h-8", "rounded-lg", "bg-white", "border", "border-slate-200", "text-red-500", "hover:bg-red-50", "transition", "shadow-sm", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "fa-trash"], [1, "font-bold", "text-slate-400", "w-8", "inline-block"], [1, "font-serif"], ["colspan", "4", 1, "p-8", "text-center", "text-slate-400", "italic"], [1, "bg-white", "rounded-2xl", "shadow-xl", "w-full", "max-w-lg", "overflow-hidden", "flex", "flex-col", "animate-slide-up"], [1, "px-6", "py-4", "border-b", "border-slate-100", "bg-slate-50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "text-lg"], [1, "w-8", "h-8", "rounded-full", "bg-white", "border", "border-slate-200", "flex", "items-center", "justify-center", "text-slate-400", "hover:text-red-500", "transition", 3, "click"], [1, "fa-solid", "fa-times"], [1, "p-6", "overflow-y-auto"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], [1, "text-xs", "font-bold", "text-slate-500", "uppercase", "block", "mb-1"], [1, "text-red-500"], ["formControlName", "name", "placeholder", "VD: Chloramphenicol", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-sm", "font-bold", "outline-none", "focus:border-indigo-500", "transition", 3, "input"], ["formControlName", "id", "placeholder", "Auto-generated ho\u1EB7c t\u1EF1 \u0111i\u1EC1n...", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "font-mono", "outline-none", "focus:border-indigo-500", "transition", "bg-white"], [1, "grid", "grid-cols-2", "gap-4"], ["formControlName", "cas_number", "placeholder", "56-75-7", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "outline-none", "focus:border-indigo-500", "transition"], ["formControlName", "default_unit", "placeholder", "ppb, \u00B5g/kg", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "outline-none", "focus:border-indigo-500", "transition"], ["formControlName", "chemical_formula", "placeholder", "C11H12Cl2N2O5", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "font-serif", "outline-none", "focus:border-indigo-500", "transition"], ["formControlName", "aliasesText", "rows", "3", "placeholder", "M\u1ED7i alias m\u1ED9t d\u00F2ng ho\u1EB7c ph\u00E2n c\u00E1ch b\u1EB1ng d\u1EA5u ch\u1EA5m ph\u1EA9y", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "outline-none", "focus:border-indigo-500", "transition", "resize-none"], ["formControlName", "description", "rows", "2", 1, "w-full", "border", "border-slate-300", "rounded-lg", "p-2.5", "text-xs", "outline-none", "focus:border-indigo-500", "transition", "resize-none"], [1, "pt-4", "flex", "justify-end", "gap-3"], ["type", "button", 1, "px-4", "py-2", "text-slate-600", "hover:bg-slate-100", "rounded-lg", "font-bold", "text-xs", "transition", 3, "click"], ["type", "submit", 1, "px-6", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-lg", "font-bold", "text-xs", "shadow-md", "transition", "disabled:opacity-50", 3, "disabled"], [1, "bg-white", "rounded-2xl", "shadow-xl", "w-full", "max-w-4xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]", "animate-slide-up"], [1, "font-black", "text-slate-800", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-file-import", "text-emerald-600"], [1, "p-4", "bg-yellow-50", "border-b", "border-yellow-100", "text-xs", "text-yellow-800", "flex", "items-start", "gap-2"], [1, "fa-solid", "fa-circle-info", "mt-0.5"], [1, "flex-1", "overflow-auto", "custom-scrollbar"], [1, "w-full", "text-xs", "text-left"], [1, "bg-slate-100", "text-slate-500", "font-bold", "uppercase", "sticky", "top-0"], [1, "p-3", "border-b", "border-slate-200"], [1, "p-3", "border-b", "border-slate-200", "text-center"], [1, "hover:bg-slate-50"], [1, "px-6", "py-4", "border-t", "border-slate-100", "bg-slate-50", "flex", "justify-end", "gap-3", "shrink-0"], [1, "px-5", "py-2.5", "text-slate-600", "hover:bg-slate-200", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], [1, "px-6", "py-2.5", "bg-emerald-600", "hover:bg-emerald-700", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "transition", "disabled:opacity-50", "flex", "items-center", "gap-2", 3, "click", "disabled"], [1, "p-3", "font-bold", "text-slate-700"], [1, "p-3", "font-mono", "text-slate-500"], [1, "p-3", "text-slate-600"], [1, "p-3", "font-serif", "text-slate-600"], [1, "p-3", "text-indigo-500"], [1, "p-3", "text-center", "bg-slate-50/50"], [1, "fa-solid", "fa-spinner", "fa-spin"], [1, "fa-solid", "fa-check"]], template: function MasterTargetManagerComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "button", 4);
            i0.ɵɵlistener("click", function MasterTargetManagerComponent_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.goBack()); });
            i0.ɵɵelement(4, "i", 5);
            i0.ɵɵelementStart(5, "span", 6);
            i0.ɵɵtext(6, "C\u1EA5u H\u00ECnh");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(7, "div", 7);
            i0.ɵɵelementStart(8, "div")(9, "h2", 8);
            i0.ɵɵelement(10, "i", 9);
            i0.ɵɵtext(11, " Th\u01B0 Vi\u1EC7n Ch\u1EC9 Ti\u00EAu G\u1ED1c ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "p", 10);
            i0.ɵɵtext(13, "Danh m\u1EE5c ch\u1EC9 ti\u00EAu g\u1ED1c");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(14, "div", 11)(15, "button", 12);
            i0.ɵɵlistener("click", function MasterTargetManagerComponent_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.migrateHyphenToUnderscore()); });
            i0.ɵɵelement(16, "i", 13);
            i0.ɵɵtext(17, " Migrate Data (- To _) ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 14);
            i0.ɵɵlistener("click", function MasterTargetManagerComponent_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.exportToExcel()); });
            i0.ɵɵelement(19, "i", 15);
            i0.ɵɵtext(20, " Export Excel ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "button", 16);
            i0.ɵɵlistener("click", function MasterTargetManagerComponent_Template_button_click_21_listener() { i0.ɵɵrestoreView(_r1); const fileInput_r2 = i0.ɵɵreference(25); return i0.ɵɵresetView(fileInput_r2.click()); });
            i0.ɵɵelement(22, "i", 17);
            i0.ɵɵtext(23, " Import Excel ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "input", 18, 0);
            i0.ɵɵlistener("change", function MasterTargetManagerComponent_Template_input_change_24_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onFileSelected($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "button", 19);
            i0.ɵɵlistener("click", function MasterTargetManagerComponent_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openModal()); });
            i0.ɵɵelement(27, "i", 20);
            i0.ɵɵtext(28, " Th\u00EAm Ch\u1EC9 Ti\u00EAu ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(29, "div", 21)(30, "div", 22);
            i0.ɵɵelement(31, "i", 23);
            i0.ɵɵelementStart(32, "input", 24);
            i0.ɵɵlistener("ngModelChange", function MasterTargetManagerComponent_Template_input_ngModelChange_32_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.searchTerm.set($event)); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "div", 25)(34, "div", 26);
            i0.ɵɵtemplate(35, MasterTargetManagerComponent_Conditional_35_Template, 2, 0, "div", 27)(36, MasterTargetManagerComponent_Conditional_36_Template, 15, 1, "table", 28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "div", 29);
            i0.ɵɵtext(38);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(39, MasterTargetManagerComponent_Conditional_39_Template, 45, 4, "div", 30)(40, MasterTargetManagerComponent_Conditional_40_Template, 45, 3, "div", 31);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(15);
            i0.ɵɵproperty("disabled", ctx.isProcessing());
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("disabled", ctx.isProcessing() || ctx.isLoading() || ctx.items().length === 0);
            i0.ɵɵadvance(14);
            i0.ɵɵproperty("ngModel", ctx.searchTerm());
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isLoading() ? 35 : 36);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1(" T\u1ED5ng s\u1ED1: ", ctx.filteredItems().length, " ch\u1EC9 ti\u00EAu ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showModal() ? 39 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.importPreview().length > 0 ? 40 : -1);
        } }, dependencies: [CommonModule, ReactiveFormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, FormsModule, i1.NgModel], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MasterTargetManagerComponent, [{
        type: Component,
        args: [{
                selector: 'app-master-target-manager',
                standalone: true,
                imports: [CommonModule, ReactiveFormsModule, FormsModule],
                template: `
    <div class="h-full flex flex-col fade-in bg-slate-50 relative pb-10">
        
        <!-- Header -->
        <div class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-30">
            <div class="flex items-center gap-4">
                <button (click)="goBack()" class="text-slate-500 hover:text-slate-800 text-sm font-bold flex items-center gap-2 transition">
                    <i class="fa-solid fa-arrow-left"></i> <span class="hidden md:inline">Cấu Hình</span>
                </button>
                <div class="h-6 w-px bg-slate-200"></div>
                <div>
                    <h2 class="text-lg font-black text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-book-medical text-indigo-600"></i> Thư Viện Chỉ Tiêu Gốc
                    </h2>
                    <p class="text-[10px] text-slate-500 mt-0.5 font-medium">Danh mục chỉ tiêu gốc</p>
                </div>
            </div>
            
            <div class="flex gap-2">
                <!-- Migrate Button -->
                <button (click)="migrateHyphenToUnderscore()" [disabled]="isProcessing()" class="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg font-bold text-xs transition flex items-center gap-2 active:scale-95 disabled:opacity-50">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Migrate Data (- To _)
                </button>

                <!-- Export Button -->
                <button (click)="exportToExcel()" [disabled]="isProcessing() || isLoading() || items().length === 0" class="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold text-xs transition flex items-center gap-2 active:scale-95 disabled:opacity-50">
                    <i class="fa-solid fa-file-export"></i> Export Excel
                </button>

                <!-- Import Button -->
                <button (click)="fileInput.click()" class="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg font-bold text-xs transition flex items-center gap-2 active:scale-95">
                    <i class="fa-solid fa-file-excel"></i> Import Excel
                </button>
                <input #fileInput type="file" class="hidden" accept=".xlsx, .csv" (change)="onFileSelected($event)">

                <button (click)="openModal()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md transition flex items-center gap-2 active:scale-95">
                    <i class="fa-solid fa-plus"></i> Thêm Chỉ Tiêu
                </button>
            </div>
        </div>

        <div class="flex-1 p-6 overflow-hidden flex flex-col">
            <!-- Search Bar -->
            <div class="mb-4 relative">
                <i class="fa-solid fa-search absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                <input [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                       class="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm"
                       placeholder="Tìm kiếm tên chất, CAS number, công thức hóa học...">
            </div>

            <!-- List -->
            <div class="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div class="overflow-y-auto custom-scrollbar flex-1 p-2">
                    @if (isLoading()) {
                        <div class="p-10 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-2xl"></i></div>
                    } @else {
                        <table class="w-full text-sm text-left border-collapse">
                            <thead class="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 font-bold">
                                <tr>
                                    <th class="px-4 py-3 border-b border-slate-100">Tên chỉ tiêu / ID</th>
                                    <th class="px-4 py-3 border-b border-slate-100">Thông tin hóa học</th>
                                    <th class="px-4 py-3 border-b border-slate-100 text-center">Đơn vị Chuẩn</th>
                                    <th class="px-4 py-3 border-b border-slate-100 text-right">Tác vụ</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @for (item of filteredItems(); track item.id) {
                                    <tr class="hover:bg-indigo-50/30 transition group">
                                        <td class="px-4 py-3">
                                            <div class="font-bold text-slate-800 text-sm">{{item.name}}</div>
                                            <div class="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1 border border-slate-200">{{item.id}}</div>
                                            @if (item.aliases?.length) {
                                                <div class="text-[10px] text-indigo-500 mt-1.5 line-clamp-2" [title]="item.aliases!.join(', ')">
                                                    Alias: {{item.aliases!.join(', ')}}
                                                </div>
                                            }
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="flex flex-col gap-1 text-xs">
                                                @if(item.cas_number) { <span class="text-slate-600"><span class="font-bold text-slate-400 w-8 inline-block">CAS:</span> {{item.cas_number}}</span> }
                                                @if(item.chemical_formula) { <span class="text-slate-600"><span class="font-bold text-slate-400 w-8 inline-block">CT:</span> <span class="font-serif">{{item.chemical_formula}}</span></span> }
                                            </div>
                                        </td>
                                        <td class="px-4 py-3 text-center">
                                            <span class="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{{item.default_unit || '-'}}</span>
                                        </td>
                                        <td class="px-4 py-3 text-right">
                                            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button (click)="openModal(item)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 transition shadow-sm flex items-center justify-center">
                                                    <i class="fa-solid fa-pen"></i>
                                                </button>
                                                <button (click)="deleteItem(item)" class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-red-500 hover:bg-red-50 transition shadow-sm flex items-center justify-center">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                } @empty {
                                    <tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Không tìm thấy dữ liệu phù hợp.</td></tr>
                                }
                            </tbody>
                        </table>
                    }
                </div>
                <div class="p-3 bg-slate-50 border-t border-slate-200 text-xs font-bold text-slate-500 text-right">
                    Tổng số: {{filteredItems().length}} chỉ tiêu
                </div>
            </div>
        </div>

        <!-- ADD/EDIT MODAL -->
        @if (showModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-slide-up">
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <h3 class="font-black text-slate-800 text-lg">
                            {{ isEditing() ? 'Cập nhật chỉ tiêu' : 'Thêm chỉ tiêu mới' }}
                        </h3>
                        <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
                    </div>
                    
                    <div class="p-6 overflow-y-auto">
                        <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Tên chỉ tiêu <span class="text-red-500">*</span></label>
                                <input formControlName="name" (input)="onNameChange($event)" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-indigo-500 transition" placeholder="VD: Chloramphenicol">
                            </div>
                            
                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Mã định danh (tự tạo)</label>
                                <input formControlName="id" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-indigo-500 transition bg-white" placeholder="Auto-generated hoặc tự điền...">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Số CAS</label>
                                    <input formControlName="cas_number" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition" placeholder="56-75-7">
                                </div>
                                <div>
                                    <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Đơn vị mặc định</label>
                                    <input formControlName="default_unit" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition" placeholder="ppb, µg/kg">
                                </div>
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Công thức hóa học</label>
                                <input formControlName="chemical_formula" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-serif outline-none focus:border-indigo-500 transition" placeholder="C11H12Cl2N2O5">
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Tên khác / Alias khi import</label>
                                <textarea formControlName="aliasesText" rows="3"
                                          class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition resize-none"
                                          placeholder="Mỗi alias một dòng hoặc phân cách bằng dấu chấm phẩy"></textarea>
                            </div>

                            <div>
                                <label class="text-xs font-bold text-slate-500 uppercase block mb-1">Mô tả / Ghi chú</label>
                                <textarea formControlName="description" rows="2" class="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-indigo-500 transition resize-none"></textarea>
                            </div>

                            <div class="pt-4 flex justify-end gap-3">
                                <button type="button" (click)="closeModal()" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-xs transition">Hủy</button>
                                <button type="submit" [disabled]="form.invalid || isProcessing()" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md transition disabled:opacity-50">
                                    {{ isEditing() ? 'Lưu thay đổi' : 'Tạo mới' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        }

        <!-- IMPORT PREVIEW MODAL -->
        @if (importPreview().length > 0) {
            <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                    <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
                            <i class="fa-solid fa-file-import text-emerald-600"></i> Xem Trước Import
                        </h3>
                        <button (click)="cancelImport()" class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i class="fa-solid fa-times"></i></button>
                    </div>

                    <div class="p-4 bg-yellow-50 border-b border-yellow-100 text-xs text-yellow-800 flex items-start gap-2">
                        <i class="fa-solid fa-circle-info mt-0.5"></i>
                        <div>
                            Kiểm tra dữ liệu bên dưới. Các dòng có <b>ID</b> trùng sẽ bị ghi đè.
                            <br>Tổng cộng: <b>{{importPreview().length}}</b> chỉ tiêu hợp lệ.
                        </div>
                    </div>

                    <div class="flex-1 overflow-auto custom-scrollbar">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-slate-100 text-slate-500 font-bold uppercase sticky top-0">
                                <tr>
                                    <th class="p-3 border-b border-slate-200">Tên chỉ tiêu</th>
                                    <th class="p-3 border-b border-slate-200">Mã định danh (tự động)</th>
                                    <th class="p-3 border-b border-slate-200">CAS</th>
                                    <th class="p-3 border-b border-slate-200">Formula</th>
                                    <th class="p-3 border-b border-slate-200">Alias</th>
                                    <th class="p-3 border-b border-slate-200 text-center">Unit</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                @for (item of importPreview(); track $index) {
                                    <tr class="hover:bg-slate-50">
                                        <td class="p-3 font-bold text-slate-700">{{item.name}}</td>
                                        <td class="p-3 font-mono text-slate-500">{{item.id}}</td>
                                        <td class="p-3 text-slate-600">{{item.cas_number || '-'}}</td>
                                        <td class="p-3 font-serif text-slate-600">{{item.chemical_formula || '-'}}</td>
                                        <td class="p-3 text-indigo-500">{{item.aliases?.join(', ') || '-'}}</td>
                                        <td class="p-3 text-center bg-slate-50/50">{{item.default_unit || '-'}}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                        <button (click)="cancelImport()" class="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-sm transition">Hủy Bỏ</button>
                        <button (click)="confirmImport()" [disabled]="isProcessing()" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                            @else { <i class="fa-solid fa-check"></i> Xác nhận Import }
                        </button>
                    </div>
                </div>
            </div>
        }
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MasterTargetManagerComponent, { className: "MasterTargetManagerComponent", filePath: "src/app/features/targets/master-target-manager.component.ts", lineNumber: 249 }); })();
function splitAliases(value) {
    return Array.from(new Set(String(value || '')
        .split(/\r?\n|;/)
        .map(alias => alias.trim())
        .filter(Boolean)));
}
//# sourceMappingURL=master-target-manager.component.js.map