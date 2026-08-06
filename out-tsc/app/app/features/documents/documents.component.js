import { Component, inject, signal, computed, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { StateService } from '../../core/services/state.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { DocumentPreviewModalComponent } from './document-preview-modal.component';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry, themeBalham, } from 'ag-grid-community';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _c0 = ["searchInput"];
const _c1 = ["fileScroller"];
const _c2 = () => [1, 2, 3, 4, 5];
const _c3 = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const _forTrack0 = ($index, $item) => $item.item.id || $item.originalIndex;
const _forTrack1 = ($index, $item) => $item.id;
function DocumentsComponent_For_22_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 32)(1, "span");
    i0.ɵɵtext(2, "...");
    i0.ɵɵelementEnd()();
} }
function DocumentsComponent_For_22_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 36);
} }
function DocumentsComponent_For_22_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 35);
    i0.ɵɵlistener("click", function DocumentsComponent_For_22_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const bcItem_r3 = i0.ɵɵnextContext().$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.goToBreadcrumb(bcItem_r3.originalIndex)); });
    i0.ɵɵtemplate(1, DocumentsComponent_For_22_Conditional_1_Conditional_1_Template, 1, 0, "i", 36);
    i0.ɵɵelementStart(2, "span", 37);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    const bcItem_r3 = ctx_r4.$implicit;
    const ɵ$index_41_r6 = ctx_r4.$index;
    const ɵ$count_41_r7 = ctx_r4.$count;
    i0.ɵɵclassProp("text-fuchsia-600", ɵ$index_41_r6 === ɵ$count_41_r7 - 1)("dark:text-fuchsia-400", ɵ$index_41_r6 === ɵ$count_41_r7 - 1);
    i0.ɵɵproperty("title", bcItem_r3.item.name);
    i0.ɵɵadvance();
    i0.ɵɵconditional(bcItem_r3.originalIndex === 0 ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(bcItem_r3.item.name);
} }
function DocumentsComponent_For_22_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 34);
} }
function DocumentsComponent_For_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, DocumentsComponent_For_22_Conditional_0_Template, 3, 0, "div", 32)(1, DocumentsComponent_For_22_Conditional_1_Template, 4, 7, "button", 33)(2, DocumentsComponent_For_22_Conditional_2_Template, 1, 0, "i", 34);
} if (rf & 2) {
    const bcItem_r3 = ctx.$implicit;
    const ɵ$index_41_r6 = ctx.$index;
    const ɵ$count_41_r7 = ctx.$count;
    i0.ɵɵconditional(bcItem_r3.isEllipsis ? 0 : 1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!(ɵ$index_41_r6 === ɵ$count_41_r7 - 1) ? 2 : -1);
} }
function DocumentsComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22);
    i0.ɵɵelement(1, "div", 38);
    i0.ɵɵelementEnd();
} }
function DocumentsComponent_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 39);
    i0.ɵɵlistener("click", function DocumentsComponent_Conditional_31_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.clearSearch()); });
    i0.ɵɵelement(1, "i", 40);
    i0.ɵɵelementEnd();
} }
function DocumentsComponent_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 41);
    i0.ɵɵelement(2, "i", 42);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3", 43);
    i0.ɵɵtext(4, "Kh\u00F4ng C\u00F3 K\u1EBFt N\u1ED1i M\u1EA1ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 44);
    i0.ɵɵtext(6, "Vui l\u00F2ng ki\u1EC3m tra l\u1EA1i k\u1EBFt n\u1ED1i Internet \u0111\u1EC3 duy\u1EC7t v\u00E0 t\u1EA3i t\u00E0i li\u1EC7u t\u1EEB Google Drive.");
    i0.ɵɵelementEnd()();
} }
function DocumentsComponent_Conditional_35_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 48);
    i0.ɵɵelement(2, "i", 49);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3", 43);
    i0.ɵɵtext(4, "L\u1ED7i T\u1EA3i D\u1EEF Li\u1EC7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 50);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 51);
    i0.ɵɵlistener("click", function DocumentsComponent_Conditional_35_Conditional_0_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r9); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.forceRefresh()); });
    i0.ɵɵtext(8, " Th\u1EED L\u1EA1i ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r3.folderError());
} }
function DocumentsComponent_Conditional_35_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 45);
    i0.ɵɵelement(1, "i", 49);
    i0.ɵɵelementStart(2, "span", 52);
    i0.ɵɵtext(3, "Kh\u00F4ng th\u1EC3 c\u1EADp nh\u1EADt. \u0110ang hi\u1EC3n th\u1ECB d\u1EEF li\u1EC7u g\u1EA7n nh\u1EA5t.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "button", 53);
    i0.ɵɵlistener("click", function DocumentsComponent_Conditional_35_Conditional_1_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r10); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.forceRefresh()); });
    i0.ɵɵtext(5, "Th\u1EED l\u1EA1i");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("title", ctx_r3.folderError() || "");
} }
function DocumentsComponent_Conditional_35_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30);
    i0.ɵɵelement(1, "i", 54);
    i0.ɵɵelementStart(2, "h3", 55);
    i0.ɵɵtext(3, "Th\u01B0 M\u1EE5c Tr\u1ED1ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 56);
    i0.ɵɵtext(5, "Kh\u00F4ng c\u00F3 t\u00E0i li\u1EC7u n\u00E0o trong th\u01B0 m\u1EE5c n\u00E0y.");
    i0.ɵɵelementEnd()();
} }
function DocumentsComponent_Conditional_35_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 30);
    i0.ɵɵelement(1, "i", 57);
    i0.ɵɵelementStart(2, "h3", 55);
    i0.ɵɵtext(3, "Kh\u00F4ng T\u00ECm Th\u1EA5y K\u1EBFt Qu\u1EA3");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 56);
    i0.ɵɵtext(5, "Th\u1EED t\u00ECm v\u1EDBi t\u1EEB kh\u00F3a kh\u00E1c xem sao.");
    i0.ɵɵelementEnd()();
} }
function DocumentsComponent_Conditional_35_Conditional_4_Conditional_3_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 61);
    i0.ɵɵelement(1, "div", 62);
    i0.ɵɵelementStart(2, "div", 63);
    i0.ɵɵelement(3, "div", 64)(4, "div", 65);
    i0.ɵɵelementEnd()();
} }
function DocumentsComponent_Conditional_35_Conditional_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, DocumentsComponent_Conditional_35_Conditional_4_Conditional_3_For_1_Template, 5, 0, "div", 61, i0.ɵɵrepeaterTrackByIdentity);
} if (rf & 2) {
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c2));
} }
function DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1, "\u2022");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r13 = i0.ɵɵnextContext().$implicit;
    const ctx_r3 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r3.formatDate(item_r13.modifiedTime, true));
} }
function DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 75);
    i0.ɵɵlistener("click", function DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Conditional_11_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r14); const item_r13 = i0.ɵɵnextContext().$implicit; const ctx_r3 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r3.downloadItem(item_r13, $event)); });
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r13 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵattribute("aria-label", "T\u1EA3i " + item_r13.name);
} }
function DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 74);
} }
function DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 67);
    i0.ɵɵlistener("click", function DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Template_div_click_0_listener() { const item_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r3 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r3.onItemClick(item_r13)); });
    i0.ɵɵelementStart(1, "div", 68);
    i0.ɵɵelement(2, "i");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 69)(4, "div", 70);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 71)(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(9, DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Conditional_9_Template, 4, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 72);
    i0.ɵɵtemplate(11, DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Conditional_11_Template, 2, 1, "button", 73)(12, DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Conditional_12_Template, 1, 0, "i", 74);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r13 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext(4);
    i0.ɵɵclassProp("p-3", ctx_r3.density() === "comfortable")("p-2", ctx_r3.density() === "compact");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("w-10", ctx_r3.density() === "comfortable")("h-10", ctx_r3.density() === "comfortable")("w-8", ctx_r3.density() === "compact")("h-8", ctx_r3.density() === "compact");
    i0.ɵɵadvance();
    i0.ɵɵclassMapInterpolate1("fa-solid ", ctx_r3.getFileTypeStyle(item_r13).icon, "");
    i0.ɵɵclassProp("text-lg", ctx_r3.density() === "comfortable")("text-sm", ctx_r3.density() === "compact");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", item_r13.name, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r3.formatSize(item_r13.size, item_r13));
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r13.modifiedTime ? 9 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r3.isFolder(item_r13) && item_r13.webContentLink ? 11 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.isFolder(item_r13) ? 12 : -1);
} }
function DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_For_1_Template, 13, 24, "div", 66, _forTrack1);
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(3);
    i0.ɵɵrepeater(ctx_r3.displayFiles());
} }
function DocumentsComponent_Conditional_35_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 46)(1, "div", 58, 1);
    i0.ɵɵlistener("scroll", function DocumentsComponent_Conditional_35_Conditional_4_Template_div_scroll_1_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onFileScroll($event)); });
    i0.ɵɵtemplate(3, DocumentsComponent_Conditional_35_Conditional_4_Conditional_3_Template, 2, 1)(4, DocumentsComponent_Conditional_35_Conditional_4_Conditional_4_Template, 2, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 59)(6, "ag-grid-angular", 60);
    i0.ɵɵlistener("gridReady", function DocumentsComponent_Conditional_35_Conditional_4_Template_ag_grid_angular_gridReady_6_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onGridReady($event)); })("sortChanged", function DocumentsComponent_Conditional_35_Conditional_4_Template_ag_grid_angular_sortChanged_6_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onGridSortChanged($event)); })("cellDoubleClicked", function DocumentsComponent_Conditional_35_Conditional_4_Template_ag_grid_angular_cellDoubleClicked_6_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onGridCellDoubleClicked($event)); })("cellKeyDown", function DocumentsComponent_Conditional_35_Conditional_4_Template_ag_grid_angular_cellKeyDown_6_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onGridCellKeyDown($event)); })("bodyScroll", function DocumentsComponent_Conditional_35_Conditional_4_Template_ag_grid_angular_bodyScroll_6_listener() { i0.ɵɵrestoreView(_r11); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onGridBodyScroll()); })("rowDataUpdated", function DocumentsComponent_Conditional_35_Conditional_4_Template_ag_grid_angular_rowDataUpdated_6_listener() { i0.ɵɵrestoreView(_r11); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.restoreGridScroll()); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r3.loading() && ctx_r3.files().length === 0 ? 3 : 4);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("data-ag-theme-mode", ctx_r3.state.darkMode() ? "dark" : "light");
    i0.ɵɵadvance();
    i0.ɵɵproperty("theme", ctx_r3.gridTheme)("rowData", ctx_r3.displayFiles())("columnDefs", ctx_r3.columnDefs)("defaultColDef", ctx_r3.defaultColDef)("rowHeight", ctx_r3.density() === "compact" ? 34 : 44)("headerHeight", 38)("loading", ctx_r3.loading() && ctx_r3.files().length === 0)("rowSelection", ctx_r3.rowSelection)("getRowId", ctx_r3.getRowId)("postSortRows", ctx_r3.postSortRows)("animateRows", false)("suppressCellFocus", false)("ensureDomOrder", true);
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_2_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 80)(1, "div", 81);
    i0.ɵɵelement(2, "div", 82);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 83);
    i0.ɵɵelement(4, "div", 84);
    i0.ɵɵelementStart(5, "div", 85);
    i0.ɵɵelement(6, "div", 86)(7, "div", 87);
    i0.ɵɵelementEnd()()();
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 78);
    i0.ɵɵrepeaterCreate(1, DocumentsComponent_Conditional_35_Conditional_5_Conditional_2_For_2_Template, 8, 0, "div", 80, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵrepeater(i0.ɵɵpureFunction0(0, _c3));
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i", 92);
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 93);
} if (rf & 2) {
    const item_r17 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("src", item_r17.thumbnailLink, i0.ɵɵsanitizeUrl);
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "i");
} if (rf & 2) {
    const item_r17 = i0.ɵɵnextContext().$implicit;
    const ctx_r3 = i0.ɵɵnextContext(4);
    i0.ɵɵclassMapInterpolate1("fa-solid ", ctx_r3.getFileTypeStyle(item_r17).icon, " text-5xl group-hover:scale-110 transition-transform");
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 101);
    i0.ɵɵlistener("click", function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_5_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r18); const item_r17 = i0.ɵɵnextContext().$implicit; const ctx_r3 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r3.downloadItem(item_r17, $event)); });
    i0.ɵɵelement(1, "i", 76);
    i0.ɵɵelementEnd();
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r16 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 90);
    i0.ɵɵlistener("click", function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Template_div_click_0_listener() { const item_r17 = i0.ɵɵrestoreView(_r16).$implicit; const ctx_r3 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r3.onItemClick(item_r17)); });
    i0.ɵɵelementStart(1, "div", 91);
    i0.ɵɵtemplate(2, DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_2_Template, 1, 0, "i", 92)(3, DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_3_Template, 1, 1, "img", 93)(4, DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_4_Template, 1, 3, "i", 94)(5, DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Conditional_5_Template, 2, 0, "button", 95);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 96)(7, "div", 97);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 98)(10, "span", 99);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span", 100);
    i0.ɵɵtext(13);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const item_r17 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext(4);
    i0.ɵɵclassProp("p-4", ctx_r3.density() === "comfortable")("p-2", ctx_r3.density() === "compact");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r3.isFolder(item_r17) ? 2 : item_r17.thumbnailLink ? 3 : 4);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(!ctx_r3.isFolder(item_r17) && item_r17.webContentLink ? 5 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("text-fuchsia-600", ctx_r3.sortCol() === "name")("dark:text-fuchsia-400", ctx_r3.sortCol() === "name");
    i0.ɵɵproperty("title", item_r17.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r17.name, " ");
    i0.ɵɵadvance(2);
    i0.ɵɵclassProp("text-fuchsia-500", ctx_r3.sortCol() === "modifiedTime")("dark:text-fuchsia-400", ctx_r3.sortCol() === "modifiedTime");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r3.formatDate(item_r17.modifiedTime, true), " ");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("text-fuchsia-500", ctx_r3.sortCol() === "size")("dark:text-fuchsia-400", ctx_r3.sortCol() === "size");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r3.formatSize(item_r17.size, item_r17), " ");
} }
function DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 88);
    i0.ɵɵrepeaterCreate(1, DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_For_2_Template, 14, 22, "div", 89, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("gap-4", ctx_r3.density() === "comfortable")("gap-2", ctx_r3.density() === "compact");
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r3.displayFiles());
} }
function DocumentsComponent_Conditional_35_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 77, 1);
    i0.ɵɵlistener("scroll", function DocumentsComponent_Conditional_35_Conditional_5_Template_div_scroll_0_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.onFileScroll($event)); });
    i0.ɵɵtemplate(2, DocumentsComponent_Conditional_35_Conditional_5_Conditional_2_Template, 3, 1, "div", 78)(3, DocumentsComponent_Conditional_35_Conditional_5_Conditional_3_Template, 3, 4, "div", 79);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("p-4", ctx_r3.density() === "comfortable")("p-2", ctx_r3.density() === "compact");
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r3.loading() && ctx_r3.files().length === 0 ? 2 : 3);
} }
function DocumentsComponent_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, DocumentsComponent_Conditional_35_Conditional_0_Template, 9, 1, "div", 30)(1, DocumentsComponent_Conditional_35_Conditional_1_Template, 6, 1, "div", 45)(2, DocumentsComponent_Conditional_35_Conditional_2_Template, 6, 0, "div", 30)(3, DocumentsComponent_Conditional_35_Conditional_3_Template, 6, 0, "div", 30)(4, DocumentsComponent_Conditional_35_Conditional_4_Template, 7, 15, "div", 46)(5, DocumentsComponent_Conditional_35_Conditional_5_Template, 4, 5, "div", 47);
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r3.folderError() && ctx_r3.files().length === 0 ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.folderError() && ctx_r3.files().length > 0 ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r3.loading() && !ctx_r3.folderError() && ctx_r3.files().length === 0 ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(!ctx_r3.loading() && !ctx_r3.folderError() && ctx_r3.files().length > 0 && ctx_r3.displayFiles().length === 0 ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((!ctx_r3.folderError() || ctx_r3.files().length > 0) && (ctx_r3.displayFiles().length > 0 || ctx_r3.loading() && ctx_r3.files().length === 0) && ctx_r3.viewMode() === "list" ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional((!ctx_r3.folderError() || ctx_r3.files().length > 0) && (ctx_r3.displayFiles().length > 0 || ctx_r3.loading() && ctx_r3.files().length === 0) && ctx_r3.viewMode() === "grid" ? 5 : -1);
} }
function DocumentsComponent_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-document-preview-modal", 102);
    i0.ɵɵlistener("closed", function DocumentsComponent_Conditional_36_Template_app_document_preview_modal_closed_0_listener() { i0.ɵɵrestoreView(_r19); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.closePreview()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵproperty("item", ctx);
} }
ModuleRegistry.registerModules([AllCommunityModule]);
function readStoredOption(key, allowed, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value && allowed.includes(value) ? value : fallback;
    }
    catch {
        return fallback;
    }
}
export class DocumentsComponent {
    constructor() {
        this.pendingPreviewKey = '__gd_pending_document_preview';
        this.navigationStateKey = '__documents_navigation_state';
        this.viewModeKey = 'documents_view_mode';
        this.densityKey = 'documents_density';
        this.sortColumnKey = 'documents_sort_column';
        this.sortDirectionKey = 'documents_sort_direction';
        this.scrollPositionsKey = '__documents_scroll_positions';
        this.driveService = inject(GoogleDriveService);
        this.state = inject(StateService);
        this.ROOT_FOLDER_ID = '19N6TRGCUuWX9N7ZaB1H5P3hygeeCUJUN';
        this.ROOT_FOLDER_NAME = 'Phiếu giao nhận mẫu';
        // Signals
        this.files = signal([]);
        this.loading = signal(true);
        this.folderError = signal(null);
        this.isOnline = signal(navigator.onLine);
        this.windowWidth = signal(window.innerWidth);
        this.isMobile = computed(() => this.windowWidth() < 640);
        this.folderStack = signal([{ id: this.ROOT_FOLDER_ID, name: this.ROOT_FOLDER_NAME }]);
        this.currentFolderId = signal(this.ROOT_FOLDER_ID);
        this.viewMode = signal(readStoredOption(this.viewModeKey, ['list', 'grid'], 'list'));
        this.density = signal(readStoredOption(this.densityKey, ['comfortable', 'compact'], 'compact'));
        // Search state (decoupled with debounce)
        this.searchInputValue = signal('');
        this.searchTerm = signal('');
        this.searchSubject = new Subject();
        this.sortCol = signal(readStoredOption(this.sortColumnKey, ['name', 'modifiedTime', 'size'], 'modifiedTime'));
        this.sortDir = signal(readStoredOption(this.sortDirectionKey, ['asc', 'desc'], 'desc'));
        this.gridTheme = themeBalham
            .withParams({
            accentColor: '#c026d3',
            backgroundColor: '#ffffff',
            foregroundColor: '#334155',
            borderColor: '#e2e8f0',
            headerBackgroundColor: '#f8fafc',
            headerTextColor: '#64748b',
            oddRowBackgroundColor: '#fafafa',
            fontFamily: 'inherit',
            fontSize: 12,
            spacing: 4,
        }, 'light')
            .withParams({
            accentColor: '#e879f9',
            backgroundColor: '#1e293b',
            foregroundColor: '#e2e8f0',
            borderColor: '#334155',
            headerBackgroundColor: '#0f172a',
            headerTextColor: '#94a3b8',
            oddRowBackgroundColor: '#1b2637',
            fontFamily: 'inherit',
            fontSize: 12,
            spacing: 4,
        }, 'dark');
        this.defaultColDef = {
            sortable: true,
            filter: true,
            resizable: true,
            minWidth: 90,
        };
        this.rowSelection = {
            mode: 'singleRow',
            checkboxes: false,
            enableClickSelection: true,
        };
        this.getRowId = (params) => params.data.id;
        this.postSortRows = (params) => {
            params.nodes.sort((left, right) => {
                const leftFolder = !!left.data && this.isFolder(left.data);
                const rightFolder = !!right.data && this.isFolder(right.data);
                if (leftFolder === rightFolder)
                    return 0;
                return leftFolder ? -1 : 1;
            });
        };
        this.columnDefs = [
            {
                headerName: '#',
                colId: 'rowNumber',
                width: 54,
                minWidth: 54,
                maxWidth: 54,
                pinned: 'left',
                sortable: false,
                filter: false,
                resizable: false,
                suppressMovable: true,
                valueGetter: params => (params.node?.rowIndex ?? 0) + 1,
                cellClass: 'documents-grid-row-number',
            },
            {
                headerName: 'Loại',
                colId: 'fileType',
                width: 70,
                minWidth: 70,
                maxWidth: 85,
                pinned: 'left',
                sortable: false,
                filter: false,
                suppressMovable: true,
                cellRenderer: (params) => {
                    if (!params.data)
                        return '';
                    const icon = document.createElement('i');
                    icon.className = `fa-solid ${this.getFileTypeStyle(params.data).icon}`;
                    icon.setAttribute('aria-hidden', 'true');
                    return icon;
                },
                cellClass: 'documents-grid-type',
            },
            {
                headerName: 'Tên tài liệu',
                field: 'name',
                colId: 'name',
                flex: 1,
                minWidth: 260,
                tooltipField: 'name',
                cellClass: 'documents-grid-name',
            },
            {
                headerName: 'Kích thước',
                field: 'size',
                colId: 'size',
                width: 130,
                minWidth: 110,
                comparator: (left, right) => (parseInt(left || '0', 10) || 0) - (parseInt(right || '0', 10) || 0),
                valueFormatter: params => this.formatSize(params.value, params.data),
                cellClass: 'documents-grid-meta',
            },
            {
                headerName: 'Ngày cập nhật',
                field: 'modifiedTime',
                colId: 'modifiedTime',
                width: 180,
                minWidth: 150,
                valueFormatter: params => this.formatDate(params.value),
                cellClass: 'documents-grid-meta',
            },
            {
                headerName: '',
                colId: 'actions',
                width: 64,
                minWidth: 64,
                maxWidth: 64,
                pinned: 'right',
                sortable: false,
                filter: false,
                resizable: false,
                suppressMovable: true,
                cellRenderer: (params) => this.createGridActionButton(params.data),
                cellClass: 'documents-grid-actions',
            },
        ];
        this.previewItem = signal(null);
        this.folderRequestId = 0;
        this.scrollPositions = {};
        // Collapsed breadcrumbs computed
        this.collapsedFolderStack = computed(() => {
            const stack = this.folderStack();
            if (stack.length <= 3) {
                return stack.map((item, index) => ({ item, originalIndex: index, isEllipsis: false }));
            }
            return [
                { item: stack[0], originalIndex: 0, isEllipsis: false },
                { item: { id: '', name: '...' }, originalIndex: -1, isEllipsis: true },
                { item: stack[stack.length - 2], originalIndex: stack.length - 2, isEllipsis: false },
                { item: stack[stack.length - 1], originalIndex: stack.length - 1, isEllipsis: false }
            ];
        });
        // Display files computed
        this.displayFiles = computed(() => {
            let arr = [...this.files()];
            const term = this.removeDiacritics(this.searchTerm().trim().toLowerCase());
            // 1. Filter
            if (term) {
                arr = arr.filter(f => this.removeDiacritics(f.name).toLowerCase().includes(term));
            }
            // 2. Sort
            const col = this.sortCol();
            const dir = this.sortDir() === 'asc' ? 1 : -1;
            arr.sort((a, b) => {
                const aIsFolder = this.isFolder(a);
                const bIsFolder = this.isFolder(b);
                if (aIsFolder && !bIsFolder)
                    return -1;
                if (!aIsFolder && bIsFolder)
                    return 1;
                let valA = a[col] || '';
                let valB = b[col] || '';
                if (col === 'size') {
                    valA = parseInt(valA, 10) || 0;
                    valB = parseInt(valB, 10) || 0;
                }
                else if (col === 'modifiedTime') {
                    valA = new Date(valA).getTime() || 0;
                    valB = new Date(valB).getTime() || 0;
                }
                else {
                    valA = valA.toString().toLowerCase();
                    valB = valB.toString().toLowerCase();
                }
                if (valA < valB)
                    return -1 * dir;
                if (valA > valB)
                    return 1 * dir;
                return 0;
            });
            return arr;
        });
    }
    onResize() {
        this.windowWidth.set(window.innerWidth);
    }
    ngOnInit() {
        this.restoreScrollPositions();
        this.restoreNavigationState();
        this.loadFolder(this.currentFolderId());
        // 2. Search debouncing
        this.searchSub = this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
            this.searchTerm.set(term);
        });
        // 3. Monitor Network Status
        this.onlineListener = () => {
            this.isOnline.set(true);
            this.forceRefresh();
        };
        this.offlineListener = () => {
            this.isOnline.set(false);
            this.folderAbortController?.abort();
            this.loading.set(false);
        };
        window.addEventListener('online', this.onlineListener);
        window.addEventListener('offline', this.offlineListener);
        const pending = sessionStorage.getItem(this.pendingPreviewKey);
        if (pending) {
            sessionStorage.removeItem(this.pendingPreviewKey);
            try {
                const item = JSON.parse(pending);
                setTimeout(() => this.onItemClick(item));
            }
            catch (_) { }
        }
    }
    ngOnDestroy() {
        this.folderRequestId++;
        this.folderAbortController?.abort();
        this.closePreview();
        if (this.searchSub)
            this.searchSub.unsubscribe();
        if (this.onlineListener)
            window.removeEventListener('online', this.onlineListener);
        if (this.offlineListener)
            window.removeEventListener('offline', this.offlineListener);
    }
    async loadFolder(folderId, skipCache = false) {
        const previousFolderId = this.currentFolderId();
        const requestId = ++this.folderRequestId;
        this.folderAbortController?.abort();
        const controller = new AbortController();
        this.folderAbortController = controller;
        this.loading.set(true);
        this.folderError.set(null);
        this.currentFolderId.set(folderId);
        // Reset local search inputs
        this.searchInputValue.set('');
        this.searchTerm.set('');
        // If offline, abort API load immediately
        if (!this.isOnline()) {
            if (requestId === this.folderRequestId)
                this.loading.set(false);
            return;
        }
        // Check service cache
        if (!skipCache) {
            const cached = this.driveService.getCachedFolder(folderId);
            if (cached) {
                if (requestId === this.folderRequestId && folderId === this.currentFolderId()) {
                    this.files.set(cached);
                    this.loading.set(false);
                    this.restoreFolderScroll();
                }
                return;
            }
        }
        if (previousFolderId !== folderId)
            this.files.set([]);
        try {
            const items = await this.driveService.getFolderContents(folderId, controller.signal);
            if (requestId !== this.folderRequestId || folderId !== this.currentFolderId())
                return;
            this.files.set(items);
            this.driveService.setCachedFolder(folderId, items);
            this.restoreFolderScroll();
        }
        catch (err) {
            if (err?.name === 'AbortError' || requestId !== this.folderRequestId)
                return;
            this.folderError.set(err?.message || 'Có lỗi xảy ra khi tải thư mục.');
        }
        finally {
            if (requestId === this.folderRequestId) {
                this.loading.set(false);
                if (this.folderAbortController === controller)
                    this.folderAbortController = undefined;
            }
        }
    }
    forceRefresh() {
        if (!this.isOnline())
            return;
        // Clear service cache for the current folder
        this.driveService.clearCache(this.currentFolderId());
        this.loadFolder(this.currentFolderId(), true);
    }
    toggleSort(col) {
        if (this.sortCol() === col) {
            this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
        }
        else {
            this.sortCol.set(col);
            this.sortDir.set(col === 'modifiedTime' ? 'desc' : 'asc');
        }
        this.storePreference(this.sortColumnKey, this.sortCol());
        this.storePreference(this.sortDirectionKey, this.sortDir());
    }
    setViewMode(mode) {
        this.viewMode.set(mode);
        this.storePreference(this.viewModeKey, mode);
        this.restoreFolderScroll();
    }
    toggleDensity() {
        const next = this.density() === 'compact' ? 'comfortable' : 'compact';
        this.density.set(next);
        this.storePreference(this.densityKey, next);
        setTimeout(() => this.gridApi?.resetRowHeights());
    }
    onGridReady(event) {
        this.gridApi = event.api;
        event.api.applyColumnState({
            state: [{ colId: this.sortCol(), sort: this.sortDir() }],
            defaultState: { sort: null },
        });
        this.restoreGridScroll();
    }
    onGridSortChanged(event) {
        const sortedColumn = event.api.getColumnState().find(column => !!column.sort);
        if (!sortedColumn)
            return;
        const colId = sortedColumn?.colId;
        if (colId !== 'name' && colId !== 'size' && colId !== 'modifiedTime')
            return;
        this.sortCol.set(colId);
        this.sortDir.set(sortedColumn.sort === 'asc' ? 'asc' : 'desc');
        this.storePreference(this.sortColumnKey, this.sortCol());
        this.storePreference(this.sortDirectionKey, this.sortDir());
    }
    onGridCellDoubleClicked(event) {
        if (event.data)
            this.onItemClick(event.data);
    }
    onGridCellKeyDown(event) {
        const keyboardEvent = event.event;
        if (!event.data)
            return;
        if (keyboardEvent.key === 'Enter') {
            keyboardEvent.preventDefault();
            this.onItemClick(event.data);
            return;
        }
        if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && keyboardEvent.key.toLowerCase() === 'f') {
            keyboardEvent.preventDefault();
            this.searchInputElement?.nativeElement?.focus();
            this.searchInputElement?.nativeElement?.select();
        }
    }
    onGridBodyScroll() {
        if (!this.gridApi)
            return;
        this.scrollPositions[this.currentFolderId()] = this.gridApi.getVerticalPixelRange().top;
        this.persistScrollPositions();
    }
    restoreGridScroll() {
        if (!this.gridApi || this.isMobile() || this.viewMode() !== 'list')
            return;
        const rowCount = this.gridApi.getDisplayedRowCount();
        if (rowCount === 0)
            return;
        const rowHeight = this.density() === 'compact' ? 34 : 44;
        const scrollTop = this.scrollPositions[this.currentFolderId()] || 0;
        const rowIndex = Math.min(Math.max(0, Math.floor(scrollTop / rowHeight)), rowCount - 1);
        setTimeout(() => this.gridApi?.ensureIndexVisible(rowIndex, 'top'));
    }
    isFolder(item) {
        return item.mimeType === 'application/vnd.google-apps.folder';
    }
    async onItemClick(item) {
        if (this.isFolder(item)) {
            this.folderStack.update(stack => [...stack, { id: item.id, name: item.name }]);
            this.saveNavigationState();
            this.loadFolder(item.id);
        }
        else {
            if (!this.isOnline())
                return;
            this.previewItem.set(item);
        }
    }
    downloadItem(item, event) {
        event.stopPropagation();
        if (!this.isOnline()) {
            return;
        }
        if (item.webContentLink) {
            openInNewTab(item.webContentLink);
        }
    }
    closePreview() {
        this.previewItem.set(null);
    }
    goToBreadcrumb(index) {
        const stack = this.folderStack();
        if (index === stack.length - 1)
            return;
        const targetStack = stack.slice(0, index + 1);
        this.folderStack.set(targetStack);
        this.saveNavigationState();
        this.loadFolder(targetStack[targetStack.length - 1].id);
    }
    onSearchChange(value) {
        this.searchInputValue.set(value);
        this.searchSubject.next(value);
    }
    clearSearch() {
        this.searchInputValue.set('');
        this.searchTerm.set('');
        this.searchSubject.next('');
        if (this.searchInputElement?.nativeElement) {
            this.searchInputElement.nativeElement.value = '';
        }
        setTimeout(() => {
            this.searchInputElement?.nativeElement?.focus();
        }, 50);
    }
    onFileScroll(event) {
        const element = event.target;
        if (!element)
            return;
        this.scrollPositions[this.currentFolderId()] = element.scrollTop;
        this.persistScrollPositions();
    }
    createGridActionButton(item) {
        if (!item)
            return '';
        if (this.isFolder(item)) {
            const folderHint = document.createElement('i');
            folderHint.className = 'fa-solid fa-chevron-right text-slate-400 text-xs';
            folderHint.setAttribute('aria-hidden', 'true');
            return folderHint;
        }
        if (!item.webContentLink)
            return '';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'w-7 h-7 rounded-md text-slate-400 hover:bg-fuchsia-100 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/40 dark:hover:text-fuchsia-300 transition-colors flex items-center justify-center';
        button.title = `Tải ${item.name}`;
        button.setAttribute('aria-label', `Tải ${item.name}`);
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-download text-xs';
        icon.setAttribute('aria-hidden', 'true');
        button.appendChild(icon);
        button.addEventListener('click', event => this.downloadItem(item, event));
        return button;
    }
    saveNavigationState() {
        try {
            sessionStorage.setItem(this.navigationStateKey, JSON.stringify(this.folderStack()));
        }
        catch {
            // Navigation persistence is optional.
        }
    }
    restoreScrollPositions() {
        try {
            const raw = sessionStorage.getItem(this.scrollPositionsKey);
            if (!raw)
                return;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
                return;
            this.scrollPositions = Object.fromEntries(Object.entries(parsed).filter((entry) => /^[a-zA-Z0-9_-]+$/.test(entry[0]) &&
                typeof entry[1] === 'number' &&
                Number.isFinite(entry[1]) &&
                entry[1] >= 0));
        }
        catch {
            sessionStorage.removeItem(this.scrollPositionsKey);
        }
    }
    persistScrollPositions() {
        try {
            sessionStorage.setItem(this.scrollPositionsKey, JSON.stringify(this.scrollPositions));
        }
        catch {
            // Scroll restoration is optional.
        }
    }
    restoreFolderScroll() {
        const folderId = this.currentFolderId();
        const scrollTop = this.scrollPositions[folderId] || 0;
        setTimeout(() => {
            if (folderId === this.currentFolderId() && this.fileScroller?.nativeElement) {
                this.fileScroller.nativeElement.scrollTop = scrollTop;
            }
            if (folderId === this.currentFolderId())
                this.restoreGridScroll();
        });
    }
    restoreNavigationState() {
        try {
            const raw = sessionStorage.getItem(this.navigationStateKey);
            if (!raw)
                return;
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0)
                return;
            const isValid = parsed.every(item => item &&
                typeof item.id === 'string' &&
                /^[a-zA-Z0-9_-]+$/.test(item.id) &&
                typeof item.name === 'string');
            if (!isValid || parsed[0].id !== this.ROOT_FOLDER_ID)
                return;
            const restored = parsed;
            this.folderStack.set(restored);
            this.currentFolderId.set(restored[restored.length - 1].id);
        }
        catch {
            sessionStorage.removeItem(this.navigationStateKey);
        }
    }
    storePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        }
        catch {
            // Preferences are non-critical when storage is unavailable.
        }
    }
    formatSize(bytes, item) {
        if (item && this.isFolder(item))
            return 'Thư mục';
        if (!bytes)
            return '--';
        const b = parseInt(bytes, 10);
        if (isNaN(b))
            return '--';
        if (b < 1024)
            return b + ' B';
        else if (b < 1048576)
            return (b / 1024).toFixed(1) + ' KB';
        else
            return (b / 1048576).toFixed(1) + ' MB';
    }
    formatDate(dateStr, short = false) {
        if (!dateStr)
            return '--';
        const d = new Date(dateStr);
        if (short) {
            return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        return d.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    removeDiacritics(str) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/gi, 'd');
    }
    getFileTypeStyle(item) {
        if (this.isFolder(item)) {
            return { icon: 'fa-folder text-yellow-400', color: 'text-yellow-400' };
        }
        const name = item.name.toLowerCase();
        if (name.endsWith('.pdf')) {
            return { icon: 'fa-file-pdf text-red-500', color: 'text-red-500' };
        }
        if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') || item.mimeType === 'application/vnd.google-apps.spreadsheet') {
            return { icon: 'fa-file-excel text-emerald-600', color: 'text-emerald-600' };
        }
        if (name.endsWith('.docx') || name.endsWith('.doc') || item.mimeType === 'application/vnd.google-apps.document') {
            return { icon: 'fa-file-word text-blue-500', color: 'text-blue-500' };
        }
        if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.7z')) {
            return { icon: 'fa-file-zipper text-amber-600', color: 'text-amber-600' };
        }
        if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif')) {
            return { icon: 'fa-file-image text-teal-500', color: 'text-teal-500' };
        }
        return { icon: 'fa-file text-slate-400', color: 'text-slate-400' };
    }
    static { this.ɵfac = function DocumentsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DocumentsComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DocumentsComponent, selectors: [["app-documents"]], viewQuery: function DocumentsComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
            i0.ɵɵviewQuery(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.searchInputElement = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.fileScroller = _t.first);
        } }, hostVars: 2, hostBindings: function DocumentsComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function DocumentsComponent_resize_HostBindingHandler() { return ctx.onResize(); }, false, i0.ɵɵresolveWindow);
        } if (rf & 2) {
            i0.ɵɵclassProp("document-preview-active", ctx.previewItem() !== null);
        } }, decls: 37, vars: 32, consts: [["searchInput", ""], ["fileScroller", ""], [1, "documents-page-enter", "h-full", "min-h-0", "w-full", "flex", "flex-col", "bg-slate-50", "dark:bg-slate-900", "p-2", "md:p-3", "relative", "overflow-hidden"], [1, "flex", "items-center", "justify-between", "gap-2", "mb-2", "bg-white", "dark:bg-slate-800", "px-2.5", "py-2", "rounded-xl", "border", "border-slate-100", "dark:border-slate-700", "shadow-sm", "shrink-0"], [1, "flex", "items-center", "gap-2", "min-w-0"], [1, "w-9", "h-9", "rounded-lg", "bg-fuchsia-50", "dark:bg-fuchsia-900/30", "text-fuchsia-600", "dark:text-fuchsia-400", "flex", "items-center", "justify-center", "border", "border-fuchsia-100", "dark:border-fuchsia-800/30", "shrink-0"], [1, "fa-solid", "fa-folder-open", "text-sm"], [1, "min-w-0"], [1, "text-base", "md:text-lg", "font-black", "text-slate-850", "dark:text-slate-100", "tracking-tight", "leading-tight", "truncate"], [1, "hidden", "xl:block", "text-[11px]", "font-medium", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "flex", "items-center", "gap-1.5", "shrink-0"], ["role", "group", "aria-label", "Ch\u1EBF \u0111\u1ED9 hi\u1EC3n th\u1ECB", 1, "hidden", "sm:flex", "items-center", "bg-slate-50", "dark:bg-slate-900", "rounded-lg", "p-0.5", "border", "border-slate-200", "dark:border-slate-700"], ["title", "Ch\u1EBF \u0111\u1ED9 danh s\u00E1ch", "aria-label", "Ch\u1EBF \u0111\u1ED9 danh s\u00E1ch", 1, "w-8", "h-8", "rounded-md", "flex", "items-center", "justify-center", "transition-colors", 3, "click"], [1, "fa-solid", "fa-list"], ["title", "Ch\u1EBF \u0111\u1ED9 l\u01B0\u1EDBi", "aria-label", "Ch\u1EBF \u0111\u1ED9 l\u01B0\u1EDBi", 1, "w-8", "h-8", "rounded-md", "flex", "items-center", "justify-center", "transition-colors", 3, "click"], [1, "fa-solid", "fa-border-all"], [1, "hidden", "md:flex", "w-9", "h-9", "items-center", "justify-center", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "text-slate-500", "dark:text-slate-300", "rounded-lg", "hover:text-fuchsia-600", "transition-colors", 3, "click", "title"], [1, "fa-solid"], ["title", "L\u00E0m m\u1EDBi d\u1EEF li\u1EC7u", "aria-label", "L\u00E0m m\u1EDBi d\u1EEF li\u1EC7u", 1, "w-9", "h-9", "bg-slate-50", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "rounded-lg", "hover:bg-slate-100", "dark:hover:bg-slate-800", "transition-colors", "flex", "items-center", "justify-center", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "fa-solid", "fa-rotate-right"], ["aria-label", "\u0110\u01B0\u1EDDng d\u1EABn th\u01B0 m\u1EE5c", 1, "mb-2", "min-h-9", "flex", "items-center", "text-xs", "font-semibold", "text-slate-600", "dark:text-slate-300", "bg-white", "dark:bg-slate-800", "px-2.5", "py-1.5", "rounded-lg", "shadow-sm", "border", "border-slate-200", "dark:border-slate-700", "overflow-x-auto", "scrollbar-none", "shrink-0"], [1, "flex-1", "min-h-0", "bg-white", "dark:bg-slate-800", "rounded-xl", "shadow-soft-xl", "border", "border-slate-200", "dark:border-slate-700", "flex", "flex-col", "relative", "overflow-hidden"], [1, "absolute", "top-0", "inset-x-0", "h-0.5", "bg-fuchsia-100", "dark:bg-fuchsia-950", "z-30", "overflow-hidden"], [1, "px-2.5", "py-2", "border-b", "border-slate-100", "dark:border-slate-700", "flex", "items-center", "gap-2", "bg-slate-50/50", "dark:bg-slate-900/50", "shrink-0"], [1, "relative", "flex-1", "max-w-md", "flex", "items-center", "gap-2"], [1, "relative", "flex-1"], [1, "fa-solid", "fa-search", "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-slate-400"], ["type", "text", 1, "w-full", "h-9", "pl-9", "pr-9", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-lg", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-fuchsia-500/50", "dark:text-white", "transition-shadow", 3, "ngModelChange", "ngModel", "placeholder"], ["type", "button", "aria-label", "X\u00F3a t\u00ECm ki\u1EBFm", 1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "z-10", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "ml-auto", "shrink-0", "font-semibold", "bg-slate-100", "dark:bg-slate-800", "px-2.5", "py-1.5", "rounded-full"], [1, "p-8", "text-center", "flex-1", "flex", "flex-col", "items-center", "justify-center", "animate-fade-in"], [3, "item"], [1, "flex", "items-center", "text-slate-400", "cursor-default", "select-none", "px-1"], [1, "flex", "items-center", "cursor-pointer", "hover:text-fuchsia-600", "dark:hover:text-fuchsia-400", "transition-colors", "whitespace-nowrap", "max-w-[180px]", "md:max-w-[320px]", 3, "text-fuchsia-600", "dark:text-fuchsia-400", "title"], [1, "fa-solid", "fa-chevron-right", "mx-2", "text-slate-400", "text-xs", "shrink-0"], [1, "flex", "items-center", "cursor-pointer", "hover:text-fuchsia-600", "dark:hover:text-fuchsia-400", "transition-colors", "whitespace-nowrap", "max-w-[180px]", "md:max-w-[320px]", 3, "click", "title"], [1, "fa-solid", "fa-home", "mr-1.5"], [1, "truncate"], [1, "h-full", "w-1/3", "bg-fuchsia-500", "animate-[loading-bar_1.2s_ease-in-out_infinite]"], ["type", "button", "aria-label", "X\u00F3a t\u00ECm ki\u1EBFm", 1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "z-10", "text-slate-400", "hover:text-slate-600", "dark:hover:text-slate-200", 3, "click"], [1, "fa-solid", "fa-times"], [1, "w-16", "h-16", "rounded-full", "bg-amber-100", "dark:bg-amber-900/30", "text-amber-500", "dark:text-amber-400", "flex", "items-center", "justify-center", "text-2xl", "mb-4"], [1, "fa-solid", "fa-plug-circle-xmark"], [1, "text-lg", "font-bold", "text-slate-800", "dark:text-white", "mb-2"], [1, "text-slate-500", "dark:text-slate-400", "text-sm", "max-w-sm"], [1, "mx-2.5", "mt-2", "px-3", "py-2", "rounded-lg", "bg-amber-50", "dark:bg-amber-900/20", "border", "border-amber-200", "dark:border-amber-800/50", "text-xs", "text-amber-700", "dark:text-amber-300", "flex", "items-center", "gap-2", "shrink-0"], [1, "flex-1", "min-h-0"], [1, "overflow-y-auto", "flex-1", "custom-scrollbar", 3, "p-4", "p-2"], [1, "w-16", "h-16", "rounded-full", "bg-red-100", "text-red-500", "flex", "items-center", "justify-center", "text-2xl", "mb-4"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "text-slate-500"], [1, "mt-4", "px-4", "py-2", "bg-slate-100", "hover:bg-slate-200", "dark:bg-slate-700", "dark:hover:bg-slate-600", "rounded-lg", "transition-colors", "font-semibold", 3, "click"], [1, "flex-1", "truncate", 3, "title"], [1, "font-bold", "hover:underline", 3, "click"], [1, "fa-regular", "fa-folder-open", "text-6xl", "text-slate-300", "dark:text-slate-600", "mb-4"], [1, "text-lg", "font-medium", "text-slate-600", "dark:text-slate-400"], [1, "text-sm", "text-slate-400", "mt-1"], [1, "fa-solid", "fa-search", "text-5xl", "text-slate-300", "dark:text-slate-600", "mb-4"], [1, "block", "sm:hidden", "h-full", "overflow-y-auto", "custom-scrollbar", "divide-y", "divide-slate-100", "dark:divide-slate-700/50", 3, "scroll"], [1, "hidden", "sm:block", "h-full", "min-h-0"], [1, "w-full", "h-full", 3, "gridReady", "sortChanged", "cellDoubleClicked", "cellKeyDown", "bodyScroll", "rowDataUpdated", "theme", "rowData", "columnDefs", "defaultColDef", "rowHeight", "headerHeight", "loading", "rowSelection", "getRowId", "postSortRows", "animateRows", "suppressCellFocus", "ensureDomOrder"], [1, "p-4", "flex", "items-center", "gap-3", "animate-pulse"], [1, "w-10", "h-10", "rounded-xl", "bg-slate-200", "dark:bg-slate-700", "shrink-0"], [1, "flex-1", "space-y-2"], [1, "h-4", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-2/3"], [1, "h-3", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-1/3"], [1, "flex", "items-center", "gap-2.5", "hover:bg-slate-50", "dark:hover:bg-slate-700/30", "transition-colors", "cursor-pointer", "active:bg-slate-100", "dark:active:bg-slate-700", 3, "p-3", "p-2"], [1, "flex", "items-center", "gap-2.5", "hover:bg-slate-50", "dark:hover:bg-slate-700/30", "transition-colors", "cursor-pointer", "active:bg-slate-100", "dark:active:bg-slate-700", 3, "click"], [1, "rounded-lg", "bg-slate-100", "dark:bg-slate-800", "flex", "items-center", "justify-center", "shrink-0"], [1, "flex-1", "min-w-0"], [1, "font-medium", "text-slate-800", "dark:text-slate-200", "text-sm", "line-clamp-2", "leading-snug"], [1, "text-[11px]", "text-slate-400", "dark:text-slate-500", "mt-1", "flex", "items-center", "gap-1.5"], [1, "shrink-0", "flex", "items-center", "gap-1", "text-slate-400", "dark:text-slate-600", "pr-1"], ["title", "T\u1EA3i xu\u1ED1ng", 1, "w-9", "h-9", "flex", "items-center", "justify-center", "rounded-lg", "hover:bg-fuchsia-50", "hover:text-fuchsia-600", "dark:hover:bg-fuchsia-900/30"], [1, "fa-solid", "fa-chevron-right", "text-xs"], ["title", "T\u1EA3i xu\u1ED1ng", 1, "w-9", "h-9", "flex", "items-center", "justify-center", "rounded-lg", "hover:bg-fuchsia-50", "hover:text-fuchsia-600", "dark:hover:bg-fuchsia-900/30", 3, "click"], [1, "fa-solid", "fa-download", "text-xs"], [1, "overflow-y-auto", "flex-1", "custom-scrollbar", 3, "scroll"], [1, "grid", "grid-cols-2", "sm:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5", "gap-4", "animate-pulse"], [1, "grid", "grid-cols-2", "sm:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5", "animate-fade-in", 3, "gap-4", "gap-2"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "p-4", "flex", "flex-col"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "py-4"], [1, "w-16", "h-16", "rounded", "bg-slate-200", "dark:bg-slate-700"], [1, "mt-2", "border-t", "border-slate-100", "dark:border-slate-700/50", "pt-3", "space-y-2"], [1, "h-4", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-3/4", "mx-auto"], [1, "flex", "justify-between", "items-center", "mt-2"], [1, "h-3", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-12"], [1, "h-3", "bg-slate-200", "dark:bg-slate-700", "rounded", "w-8"], [1, "grid", "grid-cols-2", "sm:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5", "animate-fade-in"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "flex", "flex-col", "hover:border-fuchsia-300", "dark:hover:border-fuchsia-700", "hover:shadow-md", "transition-all", "cursor-pointer", "group", 3, "p-4", "p-2"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "flex", "flex-col", "hover:border-fuchsia-300", "dark:hover:border-fuchsia-700", "hover:shadow-md", "transition-all", "cursor-pointer", "group", 3, "click"], [1, "flex-1", "flex", "flex-col", "items-center", "justify-center", "py-4", "relative", "min-h-[96px]"], [1, "fa-solid", "fa-folder", "text-yellow-400", "text-5xl", "group-hover:scale-110", "transition-transform"], ["onerror", "this.style.display='none'", "alt", "thumbnail", 1, "w-16", "h-16", "rounded", "shadow-sm", "border", "border-slate-150", "dark:border-slate-700", "object-cover", "group-hover:scale-110", "transition-transform", 3, "src"], [3, "class"], ["title", "T\u1EA3i xu\u1ED1ng", 1, "hidden", "sm:flex", "absolute", "top-0", "right-0", "w-8", "h-8", "rounded-full", "bg-white/90", "dark:bg-slate-700/90", "shadow-sm", "text-slate-500", "hover:bg-fuchsia-500", "hover:text-white", "transition-colors", "items-center", "justify-center", "opacity-0", "group-hover:opacity-100"], [1, "mt-2", "border-t", "border-slate-100", "dark:border-slate-700/50", "pt-3"], [1, "font-medium", "text-slate-800", "dark:text-slate-200", "text-sm", "line-clamp-2", "text-center", "group-hover:text-fuchsia-600", "dark:group-hover:text-fuchsia-400", "transition-colors", 3, "title"], [1, "flex", "flex-col", "sm:flex-row", "sm:justify-between", "sm:items-center", "gap-1", "mt-2"], [1, "text-[11px]", "text-slate-400"], [1, "text-[11px]", "font-semibold", "text-slate-500", "dark:text-slate-400", "sm:text-right"], ["title", "T\u1EA3i xu\u1ED1ng", 1, "hidden", "sm:flex", "absolute", "top-0", "right-0", "w-8", "h-8", "rounded-full", "bg-white/90", "dark:bg-slate-700/90", "shadow-sm", "text-slate-500", "hover:bg-fuchsia-500", "hover:text-white", "transition-colors", "items-center", "justify-center", "opacity-0", "group-hover:opacity-100", 3, "click"], [3, "closed", "item"]], template: function DocumentsComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "div", 5);
            i0.ɵɵelement(4, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "div", 7)(6, "h2", 8);
            i0.ɵɵtext(7, "Phi\u1EBFu Giao Nh\u1EADn M\u1EABu");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 9);
            i0.ɵɵtext(9, "Qu\u1EA3n l\u00FD t\u00E0i li\u1EC7u giao nh\u1EADn m\u1EABu ph\u00F2ng th\u00ED nghi\u1EC7m.");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "div", 10)(11, "div", 11)(12, "button", 12);
            i0.ɵɵlistener("click", function DocumentsComponent_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setViewMode("list")); });
            i0.ɵɵelement(13, "i", 13);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "button", 14);
            i0.ɵɵlistener("click", function DocumentsComponent_Template_button_click_14_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.setViewMode("grid")); });
            i0.ɵɵelement(15, "i", 15);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "button", 16);
            i0.ɵɵlistener("click", function DocumentsComponent_Template_button_click_16_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.toggleDensity()); });
            i0.ɵɵelement(17, "i", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 18);
            i0.ɵɵlistener("click", function DocumentsComponent_Template_button_click_18_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.forceRefresh()); });
            i0.ɵɵelement(19, "i", 19);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(20, "nav", 20);
            i0.ɵɵrepeaterCreate(21, DocumentsComponent_For_22_Template, 3, 2, null, null, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "div", 21);
            i0.ɵɵtemplate(24, DocumentsComponent_Conditional_24_Template, 2, 0, "div", 22);
            i0.ɵɵelementStart(25, "div", 23)(26, "div", 24)(27, "div", 25);
            i0.ɵɵelement(28, "i", 26);
            i0.ɵɵelementStart(29, "input", 27, 0);
            i0.ɵɵlistener("ngModelChange", function DocumentsComponent_Template_input_ngModelChange_29_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSearchChange($event)); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(31, DocumentsComponent_Conditional_31_Template, 2, 0, "button", 28);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(32, "div", 29);
            i0.ɵɵtext(33);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(34, DocumentsComponent_Conditional_34_Template, 7, 0, "div", 30)(35, DocumentsComponent_Conditional_35_Template, 6, 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(36, DocumentsComponent_Conditional_36_Template, 1, 1, "app-document-preview-modal", 31);
        } if (rf & 2) {
            let tmp_22_0;
            i0.ɵɵadvance(12);
            i0.ɵɵclassProp("bg-white", ctx.viewMode() === "list")("dark:bg-slate-800", ctx.viewMode() === "list")("text-fuchsia-600", ctx.viewMode() === "list")("text-slate-450", ctx.viewMode() !== "list");
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("bg-white", ctx.viewMode() === "grid")("dark:bg-slate-800", ctx.viewMode() === "grid")("text-fuchsia-600", ctx.viewMode() === "grid")("text-slate-455", ctx.viewMode() !== "grid");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("title", ctx.density() === "compact" ? "Chuy\u1EC3n sang hi\u1EC3n th\u1ECB tho\u00E1ng" : "Chuy\u1EC3n sang hi\u1EC3n th\u1ECB g\u1ECDn");
            i0.ɵɵattribute("aria-label", ctx.density() === "compact" ? "Chuy\u1EC3n sang hi\u1EC3n th\u1ECB tho\u00E1ng" : "Chuy\u1EC3n sang hi\u1EC3n th\u1ECB g\u1ECDn");
            i0.ɵɵadvance();
            i0.ɵɵclassProp("fa-compress", ctx.density() === "compact")("fa-arrows-up-down", ctx.density() !== "compact");
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.isOnline());
            i0.ɵɵadvance();
            i0.ɵɵclassProp("fa-spin", ctx.loading() && ctx.isOnline());
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.collapsedFolderStack());
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.loading() && ctx.files().length > 0 ? 24 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngModel", ctx.searchInputValue())("placeholder", ctx.isMobile() ? "T\u00ECm t\u00E0i li\u1EC7u..." : "T\u00ECm t\u00E0i li\u1EC7u trong th\u01B0 m\u1EE5c hi\u1EC7n t\u1EA1i...");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.searchInputValue() ? 31 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.displayFiles().length, " m\u1EE5c ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.isOnline() ? 34 : 35);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional((tmp_22_0 = ctx.previewItem()) ? 36 : -1, tmp_22_0);
        } }, dependencies: [CommonModule, FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel, AgGridAngular, DocumentPreviewModalComponent], styles: ["[_nghost-%COMP%] {\n      display: block;\n      height: 100%;\n      min-height: 0;\n    }\n    .document-preview-active[_nghost-%COMP%] {\n      position: relative;\n      z-index: 200;\n    }\n    .custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar {\n      height: 6px;\n      width: 6px;\n    }\n    .custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n      background: transparent;\n    }\n    .custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n      background: #cbd5e1;\n      border-radius: 3px;\n    }\n    .dark[_ngcontent-%COMP%]   .custom-scrollbar[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n      background: #475569;\n    }\n    .scrollbar-none[_ngcontent-%COMP%]::-webkit-scrollbar {\n      display: none;\n    }\n    .scrollbar-none[_ngcontent-%COMP%] {\n      -ms-overflow-style: none;\n      scrollbar-width: none;\n    }\n    @keyframes _ngcontent-%COMP%_loading-bar {\n      0% { transform: translateX(-120%); }\n      100% { transform: translateX(420%); }\n    }\n    [_nghost-%COMP%]     .ag-root-wrapper {\n      border: 0;\n      border-radius: 0;\n    }\n    [_nghost-%COMP%]     .ag-header-cell-label {\n      font-size: 11px;\n      font-weight: 800;\n      letter-spacing: 0.04em;\n      text-transform: uppercase;\n    }\n    [_nghost-%COMP%]     .ag-cell {\n      display: flex;\n      align-items: center;\n      border-right: 1px solid color-mix(in srgb, var(--ag-border-color) 65%, transparent);\n    }\n    [_nghost-%COMP%]     .ag-row {\n      cursor: default;\n    }\n    [_nghost-%COMP%]     .ag-row:hover .documents-grid-name {\n      color: #c026d3;\n    }\n    [_nghost-%COMP%]     .ag-row-selected::before {\n      background-color: color-mix(in srgb, #c026d3 10%, transparent);\n    }\n    [_nghost-%COMP%]     .documents-grid-row-number {\n      justify-content: center;\n      color: #94a3b8;\n      font-variant-numeric: tabular-nums;\n    }\n    [_nghost-%COMP%]     .documents-grid-type, \n   [_nghost-%COMP%]     .documents-grid-actions {\n      justify-content: center;\n    }\n    [_nghost-%COMP%]     .documents-grid-name {\n      font-size: 13px;\n      font-weight: 650;\n    }\n    [_nghost-%COMP%]     .documents-grid-meta {\n      color: #64748b;\n      font-variant-numeric: tabular-nums;\n    }\n    .dark[_nghost-%COMP%]     .documents-grid-meta, .dark   [_nghost-%COMP%]     .documents-grid-meta {\n      color: #94a3b8;\n    }\n    \n\n\n    .documents-page-enter[_ngcontent-%COMP%] {\n      animation: _ngcontent-%COMP%_documents-page-enter 180ms ease-out;\n    }\n    @keyframes _ngcontent-%COMP%_documents-page-enter {\n      from { opacity: 0; }\n      to { opacity: 1; }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DocumentsComponent, [{
        type: Component,
        args: [{ selector: 'app-documents', standalone: true, imports: [CommonModule, FormsModule, AgGridAngular, DocumentPreviewModalComponent], host: {
                    '[class.document-preview-active]': 'previewItem() !== null'
                }, template: `
    <div class="documents-page-enter h-full min-h-0 w-full flex flex-col bg-slate-50 dark:bg-slate-900 p-2 md:p-3 relative overflow-hidden">
      
      <!-- Compact header and primary actions -->
      <div class="flex items-center justify-between gap-2 mb-2 bg-white dark:bg-slate-800 px-2.5 py-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-9 h-9 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center border border-fuchsia-100 dark:border-fuchsia-800/30 shrink-0">
            <i class="fa-solid fa-folder-open text-sm"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-base md:text-lg font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight truncate">Phiếu Giao Nhận Mẫu</h2>
            <p class="hidden xl:block text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Quản lý tài liệu giao nhận mẫu phòng thí nghiệm.</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <!-- View Toggle -->
          <div class="hidden sm:flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700" role="group" aria-label="Chế độ hiển thị">
            <button (click)="setViewMode('list')"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-white]="viewMode() === 'list'" [class.dark:bg-slate-800]="viewMode() === 'list'"
                    [class.text-fuchsia-600]="viewMode() === 'list'" [class.text-slate-450]="viewMode() !== 'list'"
                    title="Chế độ danh sách" aria-label="Chế độ danh sách">
              <i class="fa-solid fa-list"></i>
            </button>
            <button (click)="setViewMode('grid')"
                    class="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
                    [class.bg-white]="viewMode() === 'grid'" [class.dark:bg-slate-800]="viewMode() === 'grid'"
                    [class.text-fuchsia-600]="viewMode() === 'grid'" [class.text-slate-455]="viewMode() !== 'grid'"
                    title="Chế độ lưới" aria-label="Chế độ lưới">
              <i class="fa-solid fa-border-all"></i>
            </button>
          </div>

          <button (click)="toggleDensity()"
                  class="hidden md:flex w-9 h-9 items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded-lg hover:text-fuchsia-600 transition-colors"
                  [title]="density() === 'compact' ? 'Chuyển sang hiển thị thoáng' : 'Chuyển sang hiển thị gọn'"
                  [attr.aria-label]="density() === 'compact' ? 'Chuyển sang hiển thị thoáng' : 'Chuyển sang hiển thị gọn'">
            <i class="fa-solid" [class.fa-compress]="density() === 'compact'" [class.fa-arrows-up-down]="density() !== 'compact'"></i>
          </button>

          <!-- Refresh Button -->
          <button (click)="forceRefresh()" 
                  [disabled]="!isOnline()"
                  class="w-9 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Làm mới dữ liệu" aria-label="Làm mới dữ liệu">
            <i class="fa-solid fa-rotate-right" [class.fa-spin]="loading() && isOnline()"></i>
          </button>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <nav class="mb-2 min-h-9 flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none shrink-0"
           aria-label="Đường dẫn thư mục">
        @for (bcItem of collapsedFolderStack(); track bcItem.item.id || bcItem.originalIndex; let i = $index; let last = $last) {
          @if (bcItem.isEllipsis) {
            <div class="flex items-center text-slate-400 cursor-default select-none px-1">
              <span>...</span>
            </div>
          } @else {
            <button class="flex items-center cursor-pointer hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors whitespace-nowrap max-w-[180px] md:max-w-[320px]"
                 [class.text-fuchsia-600]="last"
                 [class.dark:text-fuchsia-400]="last"
                 (click)="goToBreadcrumb(bcItem.originalIndex)"
                 [title]="bcItem.item.name">
              @if (bcItem.originalIndex === 0) {
                <i class="fa-solid fa-home mr-1.5"></i>
              }
              <span class="truncate">{{ bcItem.item.name }}</span>
            </button>
          }
          @if (!last) {
            <i class="fa-solid fa-chevron-right mx-2 text-slate-400 text-xs shrink-0"></i>
          }
        }
      </nav>

      <!-- Content Area -->
      <div class="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-xl shadow-soft-xl border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden">
        @if (loading() && files().length > 0) {
          <div class="absolute top-0 inset-x-0 h-0.5 bg-fuchsia-100 dark:bg-fuchsia-950 z-30 overflow-hidden">
            <div class="h-full w-1/3 bg-fuchsia-500 animate-[loading-bar_1.2s_ease-in-out_infinite]"></div>
          </div>
        }
        
        <!-- Toolbar: Search & Filter -->
        <div class="px-2.5 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div class="relative flex-1 max-w-md flex items-center gap-2">
            <div class="relative flex-1">
              <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input #searchInput
                     type="text" 
                     [ngModel]="searchInputValue()" 
                     (ngModelChange)="onSearchChange($event)"
                     [placeholder]="isMobile() ? 'Tìm tài liệu...' : 'Tìm tài liệu trong thư mục hiện tại...'" 
                     class="w-full h-9 pl-9 pr-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 dark:text-white transition-shadow">
              @if (searchInputValue()) {
                <button type="button"
                        aria-label="Xóa tìm kiếm"
                        (click)="clearSearch()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <i class="fa-solid fa-times"></i>
                </button>
              }
            </div>
          </div>
          <div class="text-xs text-slate-500 dark:text-slate-400 ml-auto shrink-0 font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-full">
            {{ displayFiles().length }} mục
          </div>
        </div>

        @if (!isOnline()) {
          <!-- Offline State -->
          <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 flex items-center justify-center text-2xl mb-4">
              <i class="fa-solid fa-plug-circle-xmark"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Không Có Kết Nối Mạng</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm">Vui lòng kiểm tra lại kết nối Internet để duyệt và tải tài liệu từ Google Drive.</p>
          </div>
        } @else {
          <!-- Error State -->
          @if (folderError() && files().length === 0) {
            <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
              <div class="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-2xl mb-4">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Lỗi Tải Dữ Liệu</h3>
              <p class="text-slate-500">{{ folderError() }}</p>
              <button (click)="forceRefresh()" class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors font-semibold">
                Thử Lại
              </button>
            </div>
          }

          @if (folderError() && files().length > 0) {
            <div class="mx-2.5 mt-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2 shrink-0">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span class="flex-1 truncate" [title]="folderError() || ''">Không thể cập nhật. Đang hiển thị dữ liệu gần nhất.</span>
              <button (click)="forceRefresh()" class="font-bold hover:underline">Thử lại</button>
            </div>
          }

          <!-- Empty State (No loading, no files) -->
          @if (!loading() && !folderError() && files().length === 0) {
            <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
              <i class="fa-regular fa-folder-open text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
              <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400">Thư Mục Trống</h3>
              <p class="text-sm text-slate-400 mt-1">Không có tài liệu nào trong thư mục này.</p>
            </div>
          }

          <!-- Search Empty State -->
          @if (!loading() && !folderError() && files().length > 0 && displayFiles().length === 0) {
            <div class="p-8 text-center flex-1 flex flex-col items-center justify-center animate-fade-in">
              <i class="fa-solid fa-search text-5xl text-slate-300 dark:text-slate-600 mb-4"></i>
              <h3 class="text-lg font-medium text-slate-600 dark:text-slate-400">Không Tìm Thấy Kết Quả</h3>
              <p class="text-sm text-slate-400 mt-1">Thử tìm với từ khóa khác xem sao.</p>
            </div>
          }

          <!-- File List (List View) -->
          @if ((!folderError() || files().length > 0) && (displayFiles().length > 0 || (loading() && files().length === 0)) && viewMode() === 'list') {
            <div class="flex-1 min-h-0">
              
              <!-- Mobile List View (visible on <640px screens) -->
              <div #fileScroller class="block sm:hidden h-full overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-700/50" (scroll)="onFileScroll($event)">
                @if (loading() && files().length === 0) {
                  @for (item of [1, 2, 3, 4, 5]; track item) {
                    <div class="p-4 flex items-center gap-3 animate-pulse">
                      <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  }
                } @else {
                  @for (item of displayFiles(); track item.id) {
                    <div class="flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer active:bg-slate-100 dark:active:bg-slate-700"
                         [class.p-3]="density() === 'comfortable'"
                         [class.p-2]="density() === 'compact'"
                         (click)="onItemClick(item)">
                      <div class="rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
                           [class.w-10]="density() === 'comfortable'" [class.h-10]="density() === 'comfortable'"
                           [class.w-8]="density() === 'compact'" [class.h-8]="density() === 'compact'">
                        <i class="fa-solid {{ getFileTypeStyle(item).icon }}" [class.text-lg]="density() === 'comfortable'" [class.text-sm]="density() === 'compact'"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-2 leading-snug">
                          {{ item.name }}
                        </div>
                        <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1.5">
                          <span>{{ formatSize(item.size, item) }}</span>
                          @if (item.modifiedTime) {
                            <span>•</span>
                            <span>{{ formatDate(item.modifiedTime, true) }}</span>
                          }
                        </div>
                      </div>
                      <div class="shrink-0 flex items-center gap-1 text-slate-400 dark:text-slate-600 pr-1">
                        @if (!isFolder(item) && item.webContentLink) {
                          <button (click)="downloadItem(item, $event)" class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-fuchsia-50 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/30" title="Tải xuống" [attr.aria-label]="'Tải ' + item.name">
                            <i class="fa-solid fa-download text-xs"></i>
                          </button>
                        }
                        @if (isFolder(item)) {
                          <i class="fa-solid fa-chevron-right text-xs"></i>
                        }
                      </div>
                    </div>
                  }
                }
              </div>

              <!-- Excel-style desktop grid -->
              <div class="hidden sm:block h-full min-h-0" [attr.data-ag-theme-mode]="state.darkMode() ? 'dark' : 'light'">
                <ag-grid-angular
                  class="w-full h-full"
                  [theme]="gridTheme"
                  [rowData]="displayFiles()"
                  [columnDefs]="columnDefs"
                  [defaultColDef]="defaultColDef"
                  [rowHeight]="density() === 'compact' ? 34 : 44"
                  [headerHeight]="38"
                  [loading]="loading() && files().length === 0"
                  [rowSelection]="rowSelection"
                  [getRowId]="getRowId"
                  [postSortRows]="postSortRows"
                  [animateRows]="false"
                  [suppressCellFocus]="false"
                  [ensureDomOrder]="true"
                  (gridReady)="onGridReady($event)"
                  (sortChanged)="onGridSortChanged($event)"
                  (cellDoubleClicked)="onGridCellDoubleClicked($event)"
                  (cellKeyDown)="onGridCellKeyDown($event)"
                  (bodyScroll)="onGridBodyScroll()"
                  (rowDataUpdated)="restoreGridScroll()">
                </ag-grid-angular>
              </div>
            </div>
          }

          <!-- Grid View -->
          @if ((!folderError() || files().length > 0) && (displayFiles().length > 0 || (loading() && files().length === 0)) && viewMode() === 'grid') {
            <div #fileScroller class="overflow-y-auto flex-1 custom-scrollbar" (scroll)="onFileScroll($event)" [class.p-4]="density() === 'comfortable'" [class.p-2]="density() === 'compact'">
              @if (loading() && files().length === 0) {
                <!-- Skeleton Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
                  @for (item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track item) {
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col">
                      <div class="flex-1 flex flex-col items-center justify-center py-4">
                        <div class="w-16 h-16 rounded bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                      <div class="mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3 space-y-2">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto"></div>
                        <div class="flex justify-between items-center mt-2">
                          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-fade-in" [class.gap-4]="density() === 'comfortable'" [class.gap-2]="density() === 'compact'">
                  @for (item of displayFiles(); track item.id) {
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col hover:border-fuchsia-300 dark:hover:border-fuchsia-700 hover:shadow-md transition-all cursor-pointer group"
                         [class.p-4]="density() === 'comfortable'" [class.p-2.5]="density() === 'compact'"
                         (click)="onItemClick(item)">
                      
                      <div class="flex-1 flex flex-col items-center justify-center py-4 relative min-h-[96px]">
                        @if (isFolder(item)) {
                          <i class="fa-solid fa-folder text-yellow-400 text-5xl group-hover:scale-110 transition-transform"></i>
                        } @else if (item.thumbnailLink) {
                          <img [src]="item.thumbnailLink" class="w-16 h-16 rounded shadow-sm border border-slate-150 dark:border-slate-700 object-cover group-hover:scale-110 transition-transform" onerror="this.style.display='none'" alt="thumbnail">
                        } @else {
                          <i class="fa-solid {{ getFileTypeStyle(item).icon }} text-5xl group-hover:scale-110 transition-transform"></i>
                        }
                        
                        @if (!isFolder(item) && item.webContentLink) {
                          <button (click)="downloadItem(item, $event)" 
                                  class="hidden sm:flex absolute top-0 right-0 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-700/90 shadow-sm text-slate-500 hover:bg-fuchsia-500 hover:text-white transition-colors items-center justify-center opacity-0 group-hover:opacity-100"
                                  title="Tải xuống">
                            <i class="fa-solid fa-download text-xs"></i>
                          </button>
                        }
                      </div>
                      
                      <div class="mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                        <div class="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-2 text-center group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors" 
                             [class.text-fuchsia-600]="sortCol() === 'name'"
                             [class.dark:text-fuchsia-400]="sortCol() === 'name'"
                             [title]="item.name">
                          {{ item.name }}
                        </div>
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mt-2">
                          <span class="text-[11px] text-slate-400"
                                [class.text-fuchsia-500]="sortCol() === 'modifiedTime'"
                                [class.dark:text-fuchsia-400]="sortCol() === 'modifiedTime'">
                            {{ formatDate(item.modifiedTime, true) }}
                          </span>
                          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 sm:text-right"
                                [class.text-fuchsia-500]="sortCol() === 'size'"
                                [class.dark:text-fuchsia-400]="sortCol() === 'size'">
                            {{ formatSize(item.size, item) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      </div>

    </div>

    @if (previewItem(); as item) {
      <app-document-preview-modal [item]="item" (closed)="closePreview()"></app-document-preview-modal>
    }
  `, styles: ["\n    :host {\n      display: block;\n      height: 100%;\n      min-height: 0;\n    }\n    :host(.document-preview-active) {\n      position: relative;\n      z-index: 200;\n    }\n    .custom-scrollbar::-webkit-scrollbar {\n      height: 6px;\n      width: 6px;\n    }\n    .custom-scrollbar::-webkit-scrollbar-track {\n      background: transparent;\n    }\n    .custom-scrollbar::-webkit-scrollbar-thumb {\n      background: #cbd5e1;\n      border-radius: 3px;\n    }\n    .dark .custom-scrollbar::-webkit-scrollbar-thumb {\n      background: #475569;\n    }\n    .scrollbar-none::-webkit-scrollbar {\n      display: none;\n    }\n    .scrollbar-none {\n      -ms-overflow-style: none;\n      scrollbar-width: none;\n    }\n    @keyframes loading-bar {\n      0% { transform: translateX(-120%); }\n      100% { transform: translateX(420%); }\n    }\n    :host ::ng-deep .ag-root-wrapper {\n      border: 0;\n      border-radius: 0;\n    }\n    :host ::ng-deep .ag-header-cell-label {\n      font-size: 11px;\n      font-weight: 800;\n      letter-spacing: 0.04em;\n      text-transform: uppercase;\n    }\n    :host ::ng-deep .ag-cell {\n      display: flex;\n      align-items: center;\n      border-right: 1px solid color-mix(in srgb, var(--ag-border-color) 65%, transparent);\n    }\n    :host ::ng-deep .ag-row {\n      cursor: default;\n    }\n    :host ::ng-deep .ag-row:hover .documents-grid-name {\n      color: #c026d3;\n    }\n    :host ::ng-deep .ag-row-selected::before {\n      background-color: color-mix(in srgb, #c026d3 10%, transparent);\n    }\n    :host ::ng-deep .documents-grid-row-number {\n      justify-content: center;\n      color: #94a3b8;\n      font-variant-numeric: tabular-nums;\n    }\n    :host ::ng-deep .documents-grid-type,\n    :host ::ng-deep .documents-grid-actions {\n      justify-content: center;\n    }\n    :host ::ng-deep .documents-grid-name {\n      font-size: 13px;\n      font-weight: 650;\n    }\n    :host ::ng-deep .documents-grid-meta {\n      color: #64748b;\n      font-variant-numeric: tabular-nums;\n    }\n    :host-context(.dark) ::ng-deep .documents-grid-meta {\n      color: #94a3b8;\n    }\n    /* Keep the route host free of transform so preview dialogs remain fixed\n       to the viewport while the page enters. */\n    .documents-page-enter {\n      animation: documents-page-enter 180ms ease-out;\n    }\n    @keyframes documents-page-enter {\n      from { opacity: 0; }\n      to { opacity: 1; }\n    }\n  "] }]
    }], null, { searchInputElement: [{
            type: ViewChild,
            args: ['searchInput']
        }], fileScroller: [{
            type: ViewChild,
            args: ['fileScroller']
        }], onResize: [{
            type: HostListener,
            args: ['window:resize']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DocumentsComponent, { className: "DocumentsComponent", filePath: "src/app/features/documents/documents.component.ts", lineNumber: 470 }); })();
//# sourceMappingURL=documents.component.js.map