import { Component, inject, signal, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StandardService } from '../standard.service';
import { FirebaseService } from '../../../core/services/firebase.service';
import { GoogleDriveService } from '../../../core/services/google-drive.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationCenterService } from '../../../core/services/notification-center.service';
import { generateSlug, UNIT_OPTIONS } from '../../../shared/utils/utils';
import { StandardTagCatalogService } from '../services/standard-tag-catalog.service';
import { sanitizeLegacyTagKeys } from '../services/standard-tag.utils';
import { StandardTagPickerComponent } from './standard-tag-picker.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.value;
function StandardsFormModalComponent_Conditional_0_For_83_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "option", 38);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const u_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", u_r3.value);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(u_r3.value);
} }
function StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 56);
} }
function StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 60);
    i0.ɵɵtext(1, " Upload ");
} }
function StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 56);
    i0.ɵɵtext(1, " Uploading... ");
} }
function StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 61);
    i0.ɵɵtext(1, " Drive ");
} }
function StandardsFormModalComponent_Conditional_0_Conditional_111_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 55);
    i0.ɵɵlistener("click", function StandardsFormModalComponent_Conditional_0_Conditional_111_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const uploadInput_r5 = i0.ɵɵreference(4); return i0.ɵɵresetView(uploadInput_r5.click()); });
    i0.ɵɵtemplate(1, StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_1_Template, 1, 0, "i", 56)(2, StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_2_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "input", 57, 0);
    i0.ɵɵlistener("change", function StandardsFormModalComponent_Conditional_0_Conditional_111_Template_input_change_3_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.uploadCoaFile($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 58);
    i0.ɵɵlistener("click", function StandardsFormModalComponent_Conditional_0_Conditional_111_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r4); const driveInput_r6 = i0.ɵɵreference(9); return i0.ɵɵresetView(driveInput_r6.click()); });
    i0.ɵɵtemplate(6, StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_6_Template, 2, 0)(7, StandardsFormModalComponent_Conditional_0_Conditional_111_Conditional_7_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "input", 59, 1);
    i0.ɵɵlistener("change", function StandardsFormModalComponent_Conditional_0_Conditional_111_Template_input_change_8_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.uploadCoaToDrive($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.isUploading() || ctx_r1.isDriveUploading());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isUploading() ? 1 : 2);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.isDriveUploading() || ctx_r1.isUploading());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isDriveUploading() ? 6 : 7);
} }
function StandardsFormModalComponent_Conditional_0_Conditional_120_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 56);
} }
function StandardsFormModalComponent_Conditional_0_Conditional_120_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 63);
    i0.ɵɵtext(1, " L\u01B0u & Th\u00EAm ti\u1EBFp ");
} }
function StandardsFormModalComponent_Conditional_0_Conditional_120_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 62);
    i0.ɵɵlistener("click", function StandardsFormModalComponent_Conditional_0_Conditional_120_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.saveStandard(true)); });
    i0.ɵɵtemplate(1, StandardsFormModalComponent_Conditional_0_Conditional_120_Conditional_1_Template, 1, 0, "i", 56)(2, StandardsFormModalComponent_Conditional_0_Conditional_120_Conditional_2_Template, 2, 0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.form.invalid || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 1 : 2);
} }
function StandardsFormModalComponent_Conditional_0_Conditional_122_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 56);
    i0.ɵɵtext(1, " \u0110ang l\u01B0u... ");
} }
function StandardsFormModalComponent_Conditional_0_Conditional_123_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.std() ? "L\u01B0u thay \u0111\u1ED5i" : "T\u1EA1o m\u1EDBi", " ");
} }
function StandardsFormModalComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "h3", 5);
    i0.ɵɵelement(4, "i", 6);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 7);
    i0.ɵɵlistener("click", function StandardsFormModalComponent_Conditional_0_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵelement(7, "i", 8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 9)(9, "form", 10)(10, "div", 11)(11, "h4", 12);
    i0.ɵɵtext(12, "1. Th\u00F4ng Tin Chung");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div")(14, "label", 13);
    i0.ɵɵtext(15, "T\u00EAn th\u01B0\u01A1ng m\u1EA1i (Commercial Name) ");
    i0.ɵɵelementStart(16, "span", 14);
    i0.ɵɵtext(17, "*");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "input", 15);
    i0.ɵɵlistener("input", function StandardsFormModalComponent_Conditional_0_Template_input_input_18_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onNameChange($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div")(20, "label", 13);
    i0.ɵɵtext(21, "T\u00EAn thay th\u1EBF (Synonyms)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(22, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "div", 17)(24, "div")(25, "label", 18);
    i0.ɵɵtext(26, "M\u00E3 s\u1EA3n ph\u1EA9m (Code)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(27, "input", 19);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(28, "div")(29, "label", 18);
    i0.ɵɵtext(30, "S\u1ED1 CAS");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(31, "input", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div")(33, "label", 18);
    i0.ɵɵtext(34, "H\u00E3ng s\u1EA3n xu\u1EA5t");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(35, "input", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "div")(37, "label", 18);
    i0.ɵɵtext(38, "H\u00E0m l\u01B0\u1EE3ng (Purity)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(39, "input", 22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "div", 23)(41, "div")(42, "label", 24);
    i0.ɵɵtext(43, "Quy c\u00E1ch (Pack Size)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(44, "input", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(45, "div")(46, "label", 24);
    i0.ɵɵtext(47, "S\u1ED1 L\u00F4 (Lot No.)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(48, "input", 26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(49, "div", 27)(50, "app-standard-tag-picker", 28);
    i0.ɵɵlistener("selectedKeysChange", function StandardsFormModalComponent_Conditional_0_Template_app_standard_tag_picker_selectedKeysChange_50_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.standardSopTags.set($event)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(51, "p", 29);
    i0.ɵɵtext(52, "Thi\u1EBFt b\u1ECB nh\u01B0 GCMS, GCMSMS, LCMSMS... \u0111\u01B0\u1EE3c suy ra t\u1EEB nh\u00E3n ph\u01B0\u01A1ng ph\u00E1p, kh\u00F4ng l\u01B0u th\u00E0nh nh\u00E3n \u0111\u1ED9c l\u1EADp.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(53, "div", 11)(54, "h4", 12);
    i0.ɵɵtext(55, "2. Kho & B\u1EA3o Qu\u1EA3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "div", 17)(57, "div")(58, "label", 18);
    i0.ɵɵtext(59, "\u0110i\u1EC1u ki\u1EC7n b\u1EA3o qu\u1EA3n");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(60, "input", 30);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "div")(62, "label", 18);
    i0.ɵɵtext(63, "V\u1ECB tr\u00ED (Location)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(64, "input", 31);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(65, "div")(66, "label", 18);
    i0.ɵɵtext(67, "M\u00E3 qu\u1EA3n l\u00FD n\u1ED9i b\u1ED9");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(68, "input", 32);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(69, "div", 33)(70, "div")(71, "label", 34);
    i0.ɵɵtext(72, "T\u1ED3n \u0111\u1EA7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(73, "input", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(74, "div")(75, "label", 34);
    i0.ɵɵtext(76, "Hi\u1EC7n t\u1EA1i");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(77, "input", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(78, "div")(79, "label", 34);
    i0.ɵɵtext(80, "\u0110\u01A1n v\u1ECB");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(81, "select", 37);
    i0.ɵɵrepeaterCreate(82, StandardsFormModalComponent_Conditional_0_For_83_Template, 2, 2, "option", 38, _forTrack0);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(84, "div", 39)(85, "h4", 12);
    i0.ɵɵtext(86, "3. H\u1ED3 S\u01A1 & H\u1EA1n D\u00F9ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(87, "div", 17)(88, "div")(89, "label", 18);
    i0.ɵɵtext(90, "Ng\u00E0y nh\u1EADn (Received)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(91, "input", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(92, "div")(93, "label", 41);
    i0.ɵɵtext(94, "H\u1EA1n s\u1EED d\u1EE5ng (Expiry)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(95, "div", 42)(96, "input", 43);
    i0.ɵɵlistener("keydown.enter", function StandardsFormModalComponent_Conditional_0_Template_input_keydown_enter_96_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveStandard(false)); });
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(97, "div", 17)(98, "div")(99, "label", 18);
    i0.ɵɵtext(100, "Ng\u00E0y m\u1EDF n\u1EAFp");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(101, "input", 44);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(102, "div")(103, "label", 18);
    i0.ɵɵtext(104, "S\u1ED1 H\u1EE3p \u0111\u1ED3ng / D\u1EF1 \u00E1n");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(105, "input", 45);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(106, "div", 27)(107, "label", 18);
    i0.ɵɵtext(108, "T\u1EC7p CoA (li\u00EAn k\u1EBFt ho\u1EB7c t\u1EA3i l\u00EAn)");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(109, "div", 46)(110, "input", 47);
    i0.ɵɵlistener("input", function StandardsFormModalComponent_Conditional_0_Template_input_input_110_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.sanitizeDriveLink($event)); })("keydown.enter", function StandardsFormModalComponent_Conditional_0_Template_input_keydown_enter_110_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveStandard(false)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(111, StandardsFormModalComponent_Conditional_0_Conditional_111_Template, 10, 4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(112, "p", 48);
    i0.ɵɵelement(113, "i", 49);
    i0.ɵɵtext(114, " N\u00FAt Drive s\u1EBD t\u1EF1 \u0111\u1ED9ng t\u1EA3i t\u1EC7p l\u00EAn Google Drive, \u0111\u1EB7t t\u00EAn theo quy \u01B0\u1EDBc v\u00E0 g\u1EAFn li\u00EAn k\u1EBFt xem tr\u01B0\u1EDBc. ");
    i0.ɵɵelementStart(115, "span", 50);
    i0.ɵɵtext(116, "Dung l\u01B0\u1EE3ng mi\u1EC5n ph\u00ED 15 GB.");
    i0.ɵɵelementEnd()()()()()();
    i0.ɵɵelementStart(117, "div", 51)(118, "button", 52);
    i0.ɵɵlistener("click", function StandardsFormModalComponent_Conditional_0_Template_button_click_118_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onClose()); });
    i0.ɵɵtext(119, "H\u1EE7y B\u1ECF");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(120, StandardsFormModalComponent_Conditional_0_Conditional_120_Template, 3, 2, "button", 53);
    i0.ɵɵelementStart(121, "button", 54);
    i0.ɵɵlistener("click", function StandardsFormModalComponent_Conditional_0_Template_button_click_121_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveStandard(false)); });
    i0.ɵɵtemplate(122, StandardsFormModalComponent_Conditional_0_Conditional_122_Template, 2, 0)(123, StandardsFormModalComponent_Conditional_0_Conditional_123_Template, 1, 1);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    let tmp_7_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.std() ? "C\u1EADp nh\u1EADt ch\u1EA5t chu\u1EA9n" : "Th\u00EAm ch\u1EA5t chu\u1EA9n m\u1EDBi", " ");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(41);
    i0.ɵɵproperty("selectedKeys", ctx_r1.standardSopTags())("options", ctx_r1.tagCatalog.selectableOptions())("max", 100);
    i0.ɵɵadvance(32);
    i0.ɵɵrepeater(ctx_r1.unitOptions);
    i0.ɵɵadvance(29);
    i0.ɵɵconditional(((tmp_7_0 = ctx_r1.auth.currentUser()) == null ? null : tmp_7_0.role) === "manager" ? 111 : -1);
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(!ctx_r1.std() ? 120 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.form.invalid || ctx_r1.isProcessing());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isProcessing() ? 122 : 123);
} }
export class StandardsFormModalComponent {
    constructor() {
        this.std = input(null);
        this.isOpen = input(false);
        this.allStandards = input([]); // To check for internal_id existence
        this.closeModal = output();
        this.fb = inject(FormBuilder);
        this.stdService = inject(StandardService);
        this.toast = inject(ToastService);
        this.firebaseService = inject(FirebaseService);
        this.googleDriveService = inject(GoogleDriveService);
        this.auth = inject(AuthService);
        this.notificationCenter = inject(NotificationCenterService);
        this.tagCatalog = inject(StandardTagCatalogService);
        this.isProcessing = signal(false);
        this.isUploading = signal(false);
        this.isDriveUploading = signal(false);
        this.standardSopTags = signal([]);
        this.originalStandardSopTags = [];
        this.unitOptions = UNIT_OPTIONS;
        this.form = this.fb.group({
            id: [''], name: ['', Validators.required], chemical_name: [''],
            product_code: [''], cas_number: [''], purity: [''], manufacturer: [''], pack_size: [''], lot_number: [''],
            internal_id: [''], location: [''], storage_condition: [''],
            initial_amount: [0, [Validators.required, Validators.min(0)]],
            current_amount: [0, [Validators.required, Validators.min(0)]],
            unit: ['mg', Validators.required],
            expiry_date: [''], received_date: [''], date_opened: [''], contract_ref: [''], certificate_ref: ['']
        });
        effect(() => {
            if (this.isOpen()) {
                const currentStd = this.std();
                if (currentStd) {
                    this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' });
                    this.form.patchValue(currentStd);
                    this.originalStandardSopTags = sanitizeLegacyTagKeys(currentStd.sop_tags || []);
                    this.standardSopTags.set([...this.originalStandardSopTags]);
                }
                else {
                    this.form.reset({ initial_amount: 0, current_amount: 0, unit: 'mg' });
                    this.originalStandardSopTags = [];
                    this.standardSopTags.set([]);
                }
            }
        });
        // Auto-fill Location based on Storage Condition
        this.form.get('storage_condition')?.valueChanges.subscribe(val => {
            if (!val)
                return;
            const lower = val.toLowerCase();
            let loc = '';
            if (lower.includes('ft') || lower.includes('đông') || lower.includes('-20'))
                loc = 'Tủ A';
            else if (lower.includes('ct') || lower.includes('mát') || lower.includes('2-8'))
                loc = 'Tủ B';
            else if (lower.includes('rt') || lower.includes('thường'))
                loc = 'Tủ C';
            if (loc && this.form.get('location')?.value !== loc) {
                this.form.patchValue({ location: loc });
            }
        });
    }
    onClose() {
        if (!this.isProcessing()) {
            this.closeModal.emit();
        }
    }
    onNameChange(event) {
        if (!this.std()) {
            const lot = this.form.get('lot_number')?.value || '';
            this.form.patchValue({ id: generateSlug(event.target.value + '_' + (lot || Date.now().toString())) });
        }
    }
    sanitizeDriveLink(event) {
        const val = event.target.value;
        if (!val)
            return;
        if (val.includes('drive.google.com') && val.includes('/view')) {
            const newVal = val.replace('/view', '/preview');
            this.form.patchValue({ certificate_ref: newVal }, { emitEvent: false });
        }
    }
    async uploadCoaFile(event) {
        if (this.isUploading())
            return;
        const file = event.target.files[0];
        if (!file)
            return;
        this.isUploading.set(true);
        try {
            const url = await this.firebaseService.uploadFile('coa', file);
            this.form.patchValue({ certificate_ref: url });
            this.toast.show('Tải CoA lên thành công!');
        }
        catch (e) {
            this.toast.show('Không thể tải CoA lên: ' + (e.message || 'Không xác định'), 'error');
        }
        finally {
            this.isUploading.set(false);
            event.target.value = '';
        }
    }
    async uploadCoaToDrive(event) {
        if (this.isDriveUploading())
            return;
        const file = event.target.files[0];
        if (!file)
            return;
        this.isDriveUploading.set(true);
        this.googleDriveService.authenticateSync(async () => {
            try {
                const stdName = this.form.value.name || 'Unknown';
                const lotNum = this.form.value.lot_number || 'NoLot';
                const fileName = GoogleDriveService.generateFileName(stdName, lotNum, file.name);
                this.toast.show(`Đang tải "${fileName}" lên Google Drive...`);
                const previewUrl = await this.googleDriveService.uploadFile(file, fileName);
                this.form.patchValue({ certificate_ref: previewUrl });
                this.toast.show(`Đã tải tệp lên Google Drive: ${fileName}`);
            }
            catch (e) {
                this.toast.show('Không thể tải tệp lên Google Drive: ' + (e.message || 'Không xác định'), 'error');
            }
            finally {
                this.isDriveUploading.set(false);
                event.target.value = '';
            }
        }, (err) => {
            this.isDriveUploading.set(false);
            this.toast.show('Lỗi đăng nhập Google: ' + err, 'error');
            event.target.value = '';
        });
    }
    async saveStandard(keepOpen = false) {
        if (this.isProcessing())
            return;
        if (this.form.invalid) {
            this.toast.show('Vui lòng điền các trường bắt buộc (*)', 'error');
            return;
        }
        const val = this.form.value;
        if (val.internal_id && val.internal_id !== 'SDHET') {
            const existing = this.allStandards().find(s => s.internal_id?.toLowerCase() === val.internal_id?.toLowerCase() &&
                s.id !== this.form.get('id')?.value);
            if (existing) {
                this.toast.show(`Cảnh báo: Mã quản lý ${val.internal_id} đã tồn tại ở chuẩn "${existing.name}".`, 'info');
            }
        }
        this.isProcessing.set(true);
        try {
            if (!this.std() && (val.initial_amount || 0) > 0 && (val.current_amount || 0) === 0) {
                val.current_amount = val.initial_amount;
            }
            if (!val.id)
                val.id = generateSlug(val.name + '_' + Date.now());
            const standardData = {
                ...val,
                name: val.name?.trim(),
                internal_id: val.internal_id?.toUpperCase().trim(),
                location: val.location?.trim(),
                sop_tags: [...this.standardSopTags()],
            };
            if (this.std()) {
                const originalStd = this.std();
                let coaNotification = null;
                // Nếu chuẩn đang có người yêu cầu CoA và Admin vừa upload/điền link CoA xong
                if (originalStd.coa_requested_by && standardData.certificate_ref) {
                    coaNotification = {
                        recipientUid: originalStd.coa_requested_by,
                        eventId: `coa-form:${standardData.id}:${encodeURIComponent(standardData.certificate_ref).slice(-160)}`,
                        message: `File CoA của chuẩn "${standardData.name}" đã được tải lên thành công qua Form Chỉnh sửa.`
                    };
                    standardData.coa_requested_by = null;
                }
                await this.stdService.updateStandard(standardData, {
                    originalTags: this.originalStandardSopTags,
                });
                if (coaNotification) {
                    const admin = this.auth.currentUser();
                    await this.notificationCenter.publish({
                        ...coaNotification,
                        senderUid: admin?.uid,
                        senderName: admin?.displayName || 'Quản trị viên',
                        type: 'SYSTEM_INFO',
                        title: 'Đã cập nhật CoA',
                        targetId: standardData.id,
                        actionUrl: `/standards/${standardData.id}`,
                        channels: ['inbox', 'push']
                    });
                }
                this.toast.show('Cập nhật chuẩn thành công!', 'success');
            }
            else {
                await this.stdService.addStandard(standardData);
                this.toast.show('Thêm chuẩn mới thành công!', 'success');
            }
            if (keepOpen && !this.std()) {
                this.form.reset({
                    initial_amount: 0,
                    current_amount: 0,
                    unit: val.unit || 'mg',
                    storage_condition: val.storage_condition,
                    location: val.location,
                    manufacturer: val.manufacturer,
                    received_date: val.received_date
                });
                this.originalStandardSopTags = [];
                this.standardSopTags.set([]);
            }
            else {
                this.closeModal.emit();
            }
        }
        catch (e) {
            this.toast.show('Lỗi: ' + e.message, 'error');
        }
        finally {
            this.isProcessing.set(false);
        }
    }
    static { this.ɵfac = function StandardsFormModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StandardsFormModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StandardsFormModalComponent, selectors: [["app-standards-form-modal"]], inputs: { std: [1, "std"], isOpen: [1, "isOpen"], allStandards: [1, "allStandards"] }, outputs: { closeModal: "closeModal" }, decls: 1, vars: 1, consts: [["uploadInput", ""], ["driveInput", ""], [1, "fixed", "inset-0", "z-[60]", "flex", "items-center", "justify-center", "p-4", "bg-slate-900/50", "backdrop-blur-sm", "fade-in"], [1, "bg-white", "dark:bg-slate-900", "rounded-2xl", "shadow-2xl", "w-full", "max-w-2xl", "overflow-hidden", "flex", "flex-col", "max-h-[90vh]", "animate-slide-up"], [1, "px-6", "py-4", "border-b", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-between", "items-center", "shrink-0"], [1, "font-black", "text-slate-800", "dark:text-slate-200", "text-lg", "flex", "items-center", "gap-2"], [1, "fa-solid", "fa-flask-vial", "text-indigo-600", "dark:text-indigo-400"], [1, "w-8", "h-8", "rounded-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "flex", "items-center", "justify-center", "text-slate-400", "dark:text-slate-500", "hover:text-red-500", "dark:hover:text-red-400", "transition", "active:scale-95", 3, "click"], [1, "fa-solid", "fa-times"], [1, "flex-1", "overflow-y-auto", "p-6", "custom-scrollbar", "bg-white", "dark:bg-slate-900"], [1, "space-y-8", 3, "formGroup"], [1, "space-y-4", "fade-in"], [1, "text-sm", "font-bold", "text-indigo-600", "dark:text-indigo-400", "mb-3", "border-b", "border-slate-100", "dark:border-slate-800", "pb-2", "uppercase", "tracking-wide"], [1, "text-xs", "font-bold", "text-slate-700", "dark:text-slate-300", "uppercase", "block", "mb-1"], [1, "text-red-500", "dark:text-red-400"], ["id", "stdNameInput", "formControlName", "name", "placeholder", "VD: Sulfadiazine Standard", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "p-3", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500", "dark:focus:ring-indigo-500/50", 3, "input"], ["formControlName", "chemical_name", "placeholder", "VD: N-(2-pyrimidinyl)benzenesulfonamide", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "p-3", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500", "dark:focus:ring-indigo-500/50", "italic"], [1, "grid", "grid-cols-2", "gap-4"], [1, "text-[10px]", "font-bold", "text-slate-400", "dark:text-slate-500", "uppercase", "block", "mb-1"], ["formControlName", "product_code", 1, "w-full", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "focus:bg-white", "dark:focus:bg-slate-800"], ["formControlName", "cas_number", 1, "w-full", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "focus:bg-white", "dark:focus:bg-slate-800"], ["formControlName", "manufacturer", 1, "w-full", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "focus:bg-white", "dark:focus:bg-slate-800"], ["formControlName", "purity", "placeholder", "VD: 99.5%", 1, "w-full", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "focus:bg-white", "dark:focus:bg-slate-800"], [1, "grid", "grid-cols-2", "gap-4", "pt-2", "border-t", "border-slate-100", "dark:border-slate-800"], [1, "text-[10px]", "font-bold", "text-indigo-700", "dark:text-indigo-400", "uppercase", "block", "mb-1"], ["formControlName", "pack_size", "placeholder", "VD: 10mg", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-indigo-200", "dark:border-indigo-800/50", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500", "dark:focus:ring-indigo-500/50"], ["formControlName", "lot_number", "placeholder", "VD: BCBW1234", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-indigo-200", "dark:border-indigo-800/50", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:ring-2", "focus:ring-indigo-500", "dark:focus:ring-indigo-500/50"], [1, "pt-2", "border-t", "border-slate-100", "dark:border-slate-800"], ["label", "Nh\u00E3n ph\u01B0\u01A1ng ph\u00E1p / SOP", 3, "selectedKeysChange", "selectedKeys", "options", "max"], [1, "mt-1", "text-[10px]", "text-slate-400", "dark:text-slate-500", "italic"], ["formControlName", "storage_condition", "placeholder", "VD: FT, CT, RT...", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500"], ["formControlName", "location", "placeholder", "T\u1EF1 \u0111\u1ED9ng t\u1EEB \u0110K b\u1EA3o qu\u1EA3n (VD: T\u1EE7 A)", 1, "w-full", "bg-slate-50", "dark:bg-slate-800/50", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500"], ["formControlName", "internal_id", "placeholder", "VD: AA01", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-300", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "font-bold", "font-mono", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "uppercase"], [1, "bg-indigo-50", "dark:bg-indigo-900/20", "p-4", "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800/50", "grid", "grid-cols-3", "gap-4"], [1, "text-[10px]", "font-bold", "text-indigo-800", "dark:text-indigo-400", "uppercase", "block", "mb-1"], ["type", "number", "formControlName", "initial_amount", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-white", "dark:border-slate-700", "rounded-lg", "p-2", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none"], ["type", "number", "formControlName", "current_amount", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-white", "dark:border-slate-700", "rounded-lg", "p-2", "text-center", "font-bold", "text-indigo-600", "dark:text-indigo-400", "outline-none", "text-lg"], ["formControlName", "unit", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-white", "dark:border-slate-700", "rounded-lg", "p-2.5", "text-center", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "h-[44px]"], [3, "value"], [1, "space-y-4", "fade-in", "pb-4"], ["type", "date", "formControlName", "received_date", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "font-bold", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "[color-scheme:light]", "dark:[color-scheme:dark]"], [1, "text-[10px]", "font-bold", "text-red-400", "dark:text-red-500", "uppercase", "block", "mb-1"], [1, "flex", "items-center", "gap-2"], ["type", "date", "formControlName", "expiry_date", 1, "w-full", "bg-red-50", "dark:bg-red-900/20", "border", "border-red-200", "dark:border-red-800/50", "rounded-lg", "p-2", "text-sm", "font-bold", "text-red-600", "dark:text-red-400", "outline-none", "focus:border-red-500", "dark:focus:border-red-500", "[color-scheme:light]", "dark:[color-scheme:dark]", 3, "keydown.enter"], ["type", "date", "formControlName", "date_opened", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", "[color-scheme:light]", "dark:[color-scheme:dark]"], ["formControlName", "contract_ref", 1, "w-full", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-sm", "text-slate-800", "dark:text-slate-200", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500"], [1, "flex", "gap-2"], ["formControlName", "certificate_ref", "placeholder", "Paste URL here...", 1, "flex-1", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "p-2", "text-xs", "text-blue-600", "dark:text-blue-400", "underline", "outline-none", "focus:border-indigo-500", "dark:focus:border-indigo-500", 3, "input", "keydown.enter"], [1, "text-[9px]", "text-slate-400", "dark:text-slate-500", "mt-1", "italic"], [1, "fa-brands", "fa-google-drive", "mr-0.5"], [1, "text-blue-500", "dark:text-blue-400"], [1, "px-6", "py-4", "border-t", "border-slate-100", "dark:border-slate-800", "bg-slate-50", "dark:bg-slate-800/50", "flex", "justify-end", "gap-3", "shrink-0"], [1, "px-5", "py-2.5", "text-slate-600", "dark:text-slate-400", "hover:bg-slate-200", "dark:hover:bg-slate-700", "rounded-xl", "font-bold", "text-sm", "transition", 3, "click"], [1, "px-5", "py-2.5", "bg-emerald-600", "dark:bg-emerald-500", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "dark:shadow-none", "transition", "disabled:opacity-50", 3, "disabled"], [1, "px-6", "py-2.5", "bg-indigo-600", "dark:bg-indigo-500", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "dark:shadow-none", "transition", "disabled:opacity-50", 3, "click", "disabled"], ["type", "button", "title", "Upload l\u00EAn Firebase Storage", 1, "bg-slate-100", "dark:bg-slate-800", "hover:bg-slate-200", "dark:hover:bg-slate-700", "text-slate-600", "dark:text-slate-400", "px-3", "py-2", "rounded-lg", "text-xs", "font-bold", "transition", "whitespace-nowrap", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-spinner", "fa-spin"], ["type", "file", 1, "hidden", 3, "change"], ["type", "button", "title", "Upload l\u00EAn Google Drive (15GB free, t\u1EF1 \u0111\u1EB7t t\u00EAn)", 1, "bg-blue-50", "dark:bg-blue-900/20", "hover:bg-blue-100", "dark:hover:bg-blue-900/40", "text-blue-600", "dark:text-blue-400", "px-3", "py-2", "rounded-lg", "text-xs", "font-bold", "transition", "whitespace-nowrap", "disabled:opacity-50", "border", "border-blue-200", "dark:border-blue-800/50", 3, "click", "disabled"], ["type", "file", "accept", ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx", 1, "hidden", 3, "change"], [1, "fa-solid", "fa-cloud-arrow-up"], [1, "fa-brands", "fa-google-drive"], [1, "px-5", "py-2.5", "bg-emerald-600", "dark:bg-emerald-500", "hover:bg-emerald-700", "dark:hover:bg-emerald-600", "text-white", "rounded-xl", "font-bold", "text-sm", "shadow-md", "dark:shadow-none", "transition", "disabled:opacity-50", 3, "click", "disabled"], [1, "fa-solid", "fa-plus"]], template: function StandardsFormModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, StandardsFormModalComponent_Conditional_0_Template, 124, 9, "div", 2);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.isOpen() ? 0 : -1);
        } }, dependencies: [CommonModule, ReactiveFormsModule, i1.ɵNgNoValidate, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, StandardTagPickerComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StandardsFormModalComponent, [{
        type: Component,
        args: [{
                selector: 'app-standards-form-modal',
                standalone: true,
                imports: [CommonModule, ReactiveFormsModule, StandardTagPickerComponent],
                template: `
      <!-- ADD/EDIT MODAL (3 TABS) -->
      @if (isOpen()) {
         <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm fade-in">
            <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center shrink-0">
                    <h3 class="font-black text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                        <i class="fa-solid fa-flask-vial text-indigo-600 dark:text-indigo-400"></i>
                        {{ std() ? 'Cập nhật chất chuẩn' : 'Thêm chất chuẩn mới' }}
                    </h3>
                    <button (click)="onClose()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition active:scale-95"><i class="fa-solid fa-times"></i></button>
                </div>

                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-slate-900">
                    <form [formGroup]="form" class="space-y-8">
                        
                        <!-- SECTION 1: GENERAL INFO -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">1. Thông Tin Chung</h4>
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên thương mại (Commercial Name) <span class="text-red-500 dark:text-red-400">*</span></label>
                                <input id="stdNameInput" formControlName="name" (input)="onNameChange($event)" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: Sulfadiazine Standard">
                            </div>
                            <!-- NEW: Chemical Name Field -->
                            <div>
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1">Tên thay thế (Synonyms)</label>
                                <input formControlName="chemical_name" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50 italic" placeholder="VD: N-(2-pyrimidinyl)benzenesulfonamide">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã sản phẩm (Code)</label><input formControlName="product_code" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số CAS</label><input formControlName="cas_number" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hãng sản xuất</label><input formControlName="manufacturer" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Hàm lượng (Purity)</label><input formControlName="purity" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800" placeholder="VD: 99.5%"></div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div><label class="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">Quy cách (Pack Size)</label><input formControlName="pack_size" class="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: 10mg"></div>
                                <div><label class="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block mb-1">Số Lô (Lot No.)</label><input formControlName="lot_number" class="w-full bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500/50" placeholder="VD: BCBW1234"></div>
                            </div>

                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <app-standard-tag-picker
                                    [selectedKeys]="standardSopTags()"
                                    [options]="tagCatalog.selectableOptions()"
                                    [max]="100"
                                    label="Nhãn phương pháp / SOP"
                                    (selectedKeysChange)="standardSopTags.set($event)"
                                />
                                <p class="mt-1 text-[10px] text-slate-400 dark:text-slate-500 italic">Thiết bị như GCMS, GCMSMS, LCMSMS... được suy ra từ nhãn phương pháp, không lưu thành nhãn độc lập.</p>
                            </div>
                        </div>

                        <!-- SECTION 2: STOCK & STORAGE -->
                        <div class="space-y-4 fade-in">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">2. Kho & Bảo Quản</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Điều kiện bảo quản</label>
                                    <input formControlName="storage_condition" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="VD: FT, CT, RT...">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Vị trí (Location)</label>
                                    <input formControlName="location" class="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="Tự động từ ĐK bảo quản (VD: Tủ A)">
                                </div>
                            </div>
                            
                            <div>
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Mã quản lý nội bộ</label>
                                <input formControlName="internal_id" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-sm font-bold font-mono text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 uppercase" placeholder="VD: AA01">
                            </div>
                            
                            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 grid grid-cols-3 gap-4">
                                <div><label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Tồn đầu</label><input type="number" formControlName="initial_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-slate-800 dark:text-slate-200 outline-none"></div>
                                <div><label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Hiện tại</label><input type="number" formControlName="current_amount" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2 text-center font-bold text-indigo-600 dark:text-indigo-400 outline-none text-lg"></div>
                                <div>
                                    <label class="text-[10px] font-bold text-indigo-800 dark:text-indigo-400 uppercase block mb-1">Đơn vị</label>
                                    <select formControlName="unit" class="w-full bg-white dark:bg-slate-800 border border-white dark:border-slate-700 rounded-lg p-2.5 text-center font-bold text-slate-800 dark:text-slate-200 outline-none h-[44px]">
                                        @for(u of unitOptions; track u.value){<option [value]="u.value">{{u.value}}</option>}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: DOCS & EXPIRY -->
                        <div class="space-y-4 fade-in pb-4">
                            <h4 class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2 uppercase tracking-wide">3. Hồ Sơ & Hạn Dùng</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày nhận (Received)</label>
                                    <input type="date" formControlName="received_date" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]">
                                </div>
                                <div>
                                    <label class="text-[10px] font-bold text-red-400 dark:text-red-500 uppercase block mb-1">Hạn sử dụng (Expiry)</label>
                                    <div class="flex items-center gap-2">
                                        <input type="date" formControlName="expiry_date" class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-2 text-sm font-bold text-red-600 dark:text-red-400 outline-none focus:border-red-500 dark:focus:border-red-500 [color-scheme:light] dark:[color-scheme:dark]" (keydown.enter)="saveStandard(false)">
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Ngày mở nắp</label><input type="date" formControlName="date_opened" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"></div>
                                <div><label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Số Hợp đồng / Dự án</label><input formControlName="contract_ref" class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-500"></div>
                            </div>
                            
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <label class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block mb-1">Tệp CoA (liên kết hoặc tải lên)</label>
                                <div class="flex gap-2">
                                    <input formControlName="certificate_ref" (input)="sanitizeDriveLink($event)" class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs text-blue-600 dark:text-blue-400 underline outline-none focus:border-indigo-500 dark:focus:border-indigo-500" placeholder="Paste URL here..." (keydown.enter)="saveStandard(false)">
                                    @if(auth.currentUser()?.role === 'manager') {
                                        <button type="button" (click)="uploadInput.click()" [disabled]="isUploading() || isDriveUploading()" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50" title="Upload lên Firebase Storage">
                                            @if(isUploading()){ <i class="fa-solid fa-spinner fa-spin"></i> } @else { <i class="fa-solid fa-cloud-arrow-up"></i> Upload }
                                        </button>
                                        <input #uploadInput type="file" class="hidden" (change)="uploadCoaFile($event)">
                                        <button type="button" (click)="driveInput.click()" [disabled]="isDriveUploading() || isUploading()" class="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap disabled:opacity-50 border border-blue-200 dark:border-blue-800/50" title="Upload lên Google Drive (15GB free, tự đặt tên)">
                                            @if(isDriveUploading()){ <i class="fa-solid fa-spinner fa-spin"></i> Uploading... } @else { <i class="fa-brands fa-google-drive"></i> Drive }
                                        </button>
                                        <input #driveInput type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" (change)="uploadCoaToDrive($event)">
                                    }
                                </div>
                                <p class="text-[9px] text-slate-400 dark:text-slate-500 mt-1 italic"><i class="fa-brands fa-google-drive mr-0.5"></i> Nút Drive sẽ tự động tải tệp lên Google Drive, đặt tên theo quy ước và gắn liên kết xem trước. <span class="text-blue-500 dark:text-blue-400">Dung lượng miễn phí 15 GB.</span></p>
                            </div>
                        </div>

                    </form>
                </div>

                <!-- Footer Actions -->
                <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 shrink-0">
                    <button (click)="onClose()" class="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold text-sm transition">Hủy Bỏ</button>
                    @if(!std()) {
                        <button (click)="saveStandard(true)" [disabled]="form.invalid || isProcessing()" class="px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                            @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> } 
                            @else { <i class="fa-solid fa-plus"></i> Lưu & Thêm tiếp }
                        </button>
                    }
                    <button (click)="saveStandard(false)" [disabled]="form.invalid || isProcessing()" class="px-6 py-2.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md dark:shadow-none transition disabled:opacity-50">
                        @if(isProcessing()) { <i class="fa-solid fa-spinner fa-spin"></i> Đang lưu... } 
                        @else { {{ std() ? 'Lưu thay đổi' : 'Tạo mới' }} }
                    </button>
                </div>
            </div>
         </div>
      }
  `
            }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StandardsFormModalComponent, { className: "StandardsFormModalComponent", filePath: "src/app/features/standards/components/standards-form-modal.component.ts", lineNumber: 166 }); })();
//# sourceMappingURL=standards-form-modal.component.js.map