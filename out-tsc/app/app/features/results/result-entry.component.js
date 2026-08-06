import { Component, inject, signal, computed, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { StateService } from '../../core/services/state.service';
import { ResultService } from './services/result.service';
import { MasterTargetService } from '../targets/master-target.service';
import { ToastService } from '../../core/services/toast.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { resolveConfigKey, ANGULAR_SOP_CONFIG, SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS, SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS } from './config/sop-configs';
import { getSafeGoogleUrl, formatSampleList } from '../../shared/utils/utils';
import { timestampToDate, timestampToLocalDateKey } from '../../shared/utils/timestamp';
import { PrintService } from '../../core/services/print.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { SopDraftFactoryService } from './services/sop-draft-factory.service';
import { buildTrifluralinPdfPayload, buildFipronilPdfPayload, buildDichlorvosPdfPayload, buildDefaultSopPdfPayload, buildUnifiedType3bPdfPayload, buildChloroformPdfPayload } from './result-pdf-helper';
import { buildPublishPreflightSummary } from './result-preflight';
// Refactored sub-components
import { ResultPrefixTabsComponent } from './components/result-prefix-tabs.component';
import { ResultRunMetadataComponent } from './components/result-run-metadata.component';
import { ResultEntryStatusBannerComponent } from './components/result-entry-status-banner.component';
import { ResultActiveReportsPanelComponent } from './components/result-active-reports-panel.component';
import { ResultEntryHeaderComponent } from './components/result-entry-header.component';
import { SopEntryOutletComponent } from './components/sop-entry-outlet.component';
import { ExcelResultImportModalComponent } from './components/excel-result-import-modal.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = () => [];
function ResultEntryComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 7);
    i0.ɵɵelement(2, "app-skeleton", 8)(3, "app-skeleton", 9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 10);
    i0.ɵɵelement(5, "app-skeleton", 11)(6, "app-skeleton", 11)(7, "app-skeleton", 11);
    i0.ɵɵelementEnd()();
} }
function ResultEntryComponent_Conditional_4_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-result-prefix-tabs", 17);
    i0.ɵɵlistener("filterChange", function ResultEntryComponent_Conditional_4_Conditional_6_Template_app_result_prefix_tabs_filterChange_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.activeFilter.set($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("prefixes", ctx_r1.detectedPrefixes())("activeFilter", ctx_r1.activeFilter());
} }
function ResultEntryComponent_Conditional_4_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "app-sop-entry-outlet", 18);
    i0.ɵɵlistener("draftChanged", function ResultEntryComponent_Conditional_4_Conditional_7_Template_app_sop_entry_outlet_draftChanged_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onDraftChanged($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    let tmp_5_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("pointer-events-none", ctx_r1.formIsReadOnly())("opacity-95", ctx_r1.formIsReadOnly());
    i0.ɵɵadvance();
    i0.ɵɵproperty("configKey", ctx_r1.configKey())("formType", ((tmp_5_0 = ctx_r1.config()) == null ? null : tmp_5_0.formType) || null)("run", ctx_r1.filteredRun())("draft", ctx_r1.draft())("config", ctx_r1.config())("activeFilter", ctx_r1.activeFilter())("isReadOnly", ctx_r1.formIsReadOnly())("publishedSampleSet", ctx_r1.publishedSampleSet());
} }
function ResultEntryComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-result-entry-status-banner", 12);
    i0.ɵɵpipe(1, "date");
    i0.ɵɵpipe(2, "date");
    i0.ɵɵpipe(3, "date");
    i0.ɵɵlistener("takeOverLock", function ResultEntryComponent_Conditional_4_Template_app_result_entry_status_banner_takeOverLock_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.takeOverLock()); })("unlockToEdit", function ResultEntryComponent_Conditional_4_Template_app_result_entry_status_banner_unlockToEdit_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.triggerUnlockToEdit()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "app-result-run-metadata", 13);
    i0.ɵɵlistener("toggleExpand", function ResultEntryComponent_Conditional_4_Template_app_result_run_metadata_toggleExpand_4_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.isMetadataExpanded.set(!ctx_r1.isMetadataExpanded())); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "app-result-active-reports-panel", 14);
    i0.ɵɵlistener("openPdf", function ResultEntryComponent_Conditional_4_Template_app_result_active_reports_panel_openPdf_5_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openPdfPreview($event.pdfUrl, $event.docsUrl)); });
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, ResultEntryComponent_Conditional_4_Conditional_6_Template, 1, 2, "app-result-prefix-tabs", 15)(7, ResultEntryComponent_Conditional_4_Conditional_7_Template, 2, 12, "div", 16);
} if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_18_0;
    let tmp_20_0;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("lockedByOthers", ctx_r1.lockedByOthers())("lockerName", ((tmp_2_0 = ctx_r1.run()) == null ? null : tmp_2_0.lockedByName) || "")("lockedAt", i0.ɵɵpipeBind2(1, 23, ctx_r1.convertToDate((tmp_3_0 = ctx_r1.run()) == null ? null : tmp_3_0.lockedAt), "HH:mm dd/MM/yyyy") || "")("lastActiveAt", i0.ɵɵpipeBind2(2, 26, ctx_r1.convertToDate((tmp_4_0 = ctx_r1.run()) == null ? null : tmp_4_0.lastActiveAt), "HH:mm:ss") || "")("isCompleted", ((tmp_5_0 = ctx_r1.draft()) == null ? null : tmp_5_0.status) === "completed")("sampleTotal", ctx_r1.samplePublishProgress().total)("completedBy", ((tmp_7_0 = ctx_r1.draft()) == null ? null : tmp_7_0.updatedBy) || "")("completedAt", i0.ɵɵpipeBind2(3, 29, ctx_r1.convertToDate((tmp_8_0 = ctx_r1.draft()) == null ? null : tmp_8_0.updatedAt), "HH:mm dd/MM/yyyy") || "");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("run", ctx_r1.run())("isExpanded", ctx_r1.isMetadataExpanded())("displayDevice", ctx_r1.getDisplayDevice())("formatSampleListFn", ctx_r1.formatSampleList)("formatAnalysisDateFn", ctx_r1.formatAnalysisDate.bind(ctx_r1));
    i0.ɵɵadvance();
    i0.ɵɵproperty("hasAnyReports", ctx_r1.hasAnyActiveReports())("generalReport", ctx_r1.getGeneralReport())("prefixes", ctx_r1.detectedPrefixes())("getAllReportsForPrefixFn", ctx_r1.getAllReportsForPrefix.bind(ctx_r1))("draftStatus", ((tmp_18_0 = ctx_r1.draft()) == null ? null : tmp_18_0.status) || "draft")("progress", ctx_r1.samplePublishProgress())("sampleList", ((tmp_20_0 = ctx_r1.run()) == null ? null : tmp_20_0.sampleList) || i0.ɵɵpureFunction0(32, _c0))("historyList", ctx_r1.historyList());
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.detectedPrefixes().length > 1 ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.renderDraftForm() ? 7 : -1);
} }
function ResultEntryComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 4)(1, "div", 19);
    i0.ɵɵelement(2, "i", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 21);
    i0.ɵɵtext(4, " Kh\u00F4ng th\u1EC3 t\u00ECm th\u1EA5y m\u1EBB ch\u1EA1y ho\u1EB7c c\u1EA5u h\u00ECnh t\u01B0\u01A1ng \u1EE9ng c\u1EE7a ch\u1EC9 ti\u00EAu n\u00E0y! ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 22);
    i0.ɵɵlistener("click", function ResultEntryComponent_Conditional_5_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵtext(6, " Quay L\u1EA1i Danh S\u00E1ch ");
    i0.ɵɵelementEnd()();
} }
function ResultEntryComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-excel-result-import-modal", 23);
    i0.ɵɵlistener("cancelled", function ResultEntryComponent_Conditional_6_Template_app_excel_result_import_modal_cancelled_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeExcelImport()); })("applied", function ResultEntryComponent_Conditional_6_Template_app_excel_result_import_modal_applied_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onExcelImportApplied($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("file", ctx_r1.excelImportFile())("run", ctx_r1.run())("draft", ctx_r1.draft())("config", ctx_r1.config())("configKey", ctx_r1.configKey())("masterTargets", ctx_r1.masterTargets())("isReadOnly", ctx_r1.formIsReadOnly());
} }
function ResultEntryComponent_Conditional_7_Conditional_14_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 46);
    i0.ɵɵelement(1, "i", 47);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r8 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r8);
} }
function ResultEntryComponent_Conditional_7_Conditional_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 34)(1, "div", 44);
    i0.ɵɵtext(2, "C\u1EA7n x\u1EED l\u00FD tr\u01B0\u1EDBc khi in");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 45);
    i0.ɵɵrepeaterCreate(4, ResultEntryComponent_Conditional_7_Conditional_14_For_5_Template, 4, 1, "li", 46, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.preflightSummary().blockers);
} }
function ResultEntryComponent_Conditional_7_Conditional_15_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 46);
    i0.ɵɵelement(1, "i", 50);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r9 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r9);
} }
function ResultEntryComponent_Conditional_7_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35)(1, "div", 48);
    i0.ɵɵtext(2, "C\u1EA3nh b\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 49);
    i0.ɵɵrepeaterCreate(4, ResultEntryComponent_Conditional_7_Conditional_15_For_5_Template, 4, 1, "li", 46, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.preflightSummary().warnings);
} }
function ResultEntryComponent_Conditional_7_Conditional_16_For_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 46);
    i0.ɵɵelement(1, "i", 52);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r10 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r10);
} }
function ResultEntryComponent_Conditional_7_Conditional_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 36)(1, "div", 38);
    i0.ɵɵtext(2, "Th\u00F4ng tin ph\u1EA1m vi in");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ul", 51);
    i0.ɵɵrepeaterCreate(4, ResultEntryComponent_Conditional_7_Conditional_16_For_5_Template, 4, 1, "li", 46, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵrepeater(ctx_r1.preflightSummary().info);
} }
function ResultEntryComponent_Conditional_7_For_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 40)(1, "span", 53);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 54);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const chunk_r11 = ctx.$implicit;
    const ɵ$index_140_r12 = ctx.$index;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Phi\u1EBFu ", ɵ$index_140_r12 + 1, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(chunk_r11.join(", "));
} }
function ResultEntryComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 24)(2, "div", 25)(3, "div", 26)(4, "div", 27);
    i0.ɵɵelement(5, "i", 28);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "h3", 29);
    i0.ɵɵtext(8, "Ki\u1EC3m tra tr\u01B0\u1EDBc khi t\u1EA1o b\u00E1o c\u00E1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 30);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 31);
    i0.ɵɵlistener("click", function ResultEntryComponent_Conditional_7_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePreflightModal()); });
    i0.ɵɵelement(12, "i", 32);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 33);
    i0.ɵɵtemplate(14, ResultEntryComponent_Conditional_7_Conditional_14_Template, 6, 0, "div", 34)(15, ResultEntryComponent_Conditional_7_Conditional_15_Template, 6, 0, "div", 35)(16, ResultEntryComponent_Conditional_7_Conditional_16_Template, 6, 0, "div", 36);
    i0.ɵɵelementStart(17, "div", 37)(18, "div", 38);
    i0.ɵɵtext(19, "C\u00E1c phi\u1EBFu s\u1EBD t\u1EA1o");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "div", 39);
    i0.ɵɵrepeaterCreate(21, ResultEntryComponent_Conditional_7_For_22_Template, 5, 2, "div", 40, i0.ɵɵrepeaterTrackByIndex);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(23, "div", 41)(24, "button", 42);
    i0.ɵɵlistener("click", function ResultEntryComponent_Conditional_7_Template_button_click_24_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closePreflightModal()); });
    i0.ɵɵtext(25, " Quay l\u1EA1i ki\u1EC3m tra ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "button", 43);
    i0.ɵɵlistener("click", function ResultEntryComponent_Conditional_7_Template_button_click_26_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.confirmPublishAfterPreflight()); });
    i0.ɵɵtext(27, " Ti\u1EBFp t\u1EE5c t\u1EA1o PDF ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(10);
    i0.ɵɵtextInterpolate2(" ", ctx_r1.preflightSummary().includedSamples.length, " m\u1EABu, ", ctx_r1.preflightSummary().chunks.length, " phi\u1EBFu d\u1EF1 ki\u1EBFn ");
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.preflightSummary().blockers.length > 0 ? 14 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.preflightSummary().warnings.length > 0 ? 15 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.preflightSummary().info.length > 0 ? 16 : -1);
    i0.ɵɵadvance(5);
    i0.ɵɵrepeater(ctx_r1.preflightSummary().chunks);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r1.preflightSummary().blockers.length > 0 || ctx_r1.isProcessing());
} }
function ResultEntryComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 55)(2, "div", 56)(3, "div", 57);
    i0.ɵɵelement(4, "i", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h3", 59);
    i0.ɵɵtext(6, "\u0110\u01B0a M\u1EBB v\u1EC1 Tr\u1EA1ng Th\u00E1i Ban \u0110\u1EA7u");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "p", 60);
    i0.ɵɵtext(8, " H\u00E0nh \u0111\u1ED9ng n\u00E0y s\u1EBD ");
    i0.ɵɵelementStart(9, "strong", 61);
    i0.ɵɵtext(10, "x\u00F3a s\u1ED1 li\u1EC7u hi\u1EC7n t\u1EA1i v\u00E0 kh\u1EDFi t\u1EA1o l\u1EA1i \u0111\u1EA7y \u0111\u1EE7 gi\u00E1 tr\u1ECB m\u1EB7c \u0111\u1ECBnh c\u1EE7a SOP");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(11, ", gi\u1ED1ng h\u1EC7t l\u1EA7n \u0111\u1EA7u m\u1EDF m\u1EBB. C\u00E1c b\u00E1o c\u00E1o PDF \u0111\u00E3 in \u0111\u01B0\u1EE3c chuy\u1EC3n v\u00E0o th\u01B0 m\u1EE5c Archived. B\u1EA1n kh\u00F4ng th\u1EC3 ho\u00E0n t\u00E1c h\u00E0nh \u0111\u1ED9ng n\u00E0y. ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "div", 62)(13, "label", 63);
    i0.ɵɵtext(14, " \u0110\u1EC3 x\u00E1c nh\u1EADn, vui l\u00F2ng nh\u1EADp ch\u1EEF ");
    i0.ɵɵelementStart(15, "span", 64);
    i0.ɵɵtext(16, "X\u00D3A");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17, " v\u00E0o \u00F4 d\u01B0\u1EDBi \u0111\u00E2y: ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "input", 65);
    i0.ɵɵlistener("input", function ResultEntryComponent_Conditional_8_Template_input_input_18_listener($event) { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onResetConfirmInput($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 66)(20, "button", 67);
    i0.ɵɵlistener("click", function ResultEntryComponent_Conditional_8_Template_button_click_20_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.closeResetModal()); });
    i0.ɵɵtext(21, " H\u1EE7y B\u1ECF ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "button", 68);
    i0.ɵɵlistener("click", function ResultEntryComponent_Conditional_8_Template_button_click_22_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.triggerResetResults()); });
    i0.ɵɵtext(23, " X\u00F3a v\u00E0 Kh\u1EDFi T\u1EA1o L\u1EA1i ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(18);
    i0.ɵɵproperty("value", ctx_r1.resetConfirmText());
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.resetConfirmText() !== "X\u00D3A" || ctx_r1.isProcessing());
} }
export class ResultEntryComponent {
    convertToDate(timestamp) {
        return timestampToDate(timestamp);
    }
    onUserActivity() {
        this.hasUnsavedChangesActivity = true;
    }
    unloadNotification($event) {
        if (this.autoSaveStatus() !== 'synced') {
            $event.returnValue = true;
        }
        this.releaseLockIfNeeded();
    }
    onUnload() {
        this.releaseLockIfNeeded();
    }
    releaseLockIfNeeded() {
        const r = this.run();
        const user = this.auth.currentUser();
        if (r && user && r.lockedBy === user.email) {
            this.resultService.releaseLock(this.requestId);
        }
    }
    toggleActionsMenu() {
        this.showActionsMenu.update(v => !v);
    }
    closeActionsMenu() {
        this.showActionsMenu.set(false);
    }
    toggleRestoreMenu() {
        this.showRestoreMenu.update(v => !v);
    }
    closeRestoreMenu() {
        this.showRestoreMenu.set(false);
    }
    getDisplayDevice() {
        const r = this.run();
        if (!r)
            return 'GC-MS/MS / LC-MS/MS';
        // Tier 1 & 2: Explicitly passed from smart batch or legacy input
        if (r.inputs?.device)
            return r.inputs.device;
        if (r.inputs?.instrument)
            return r.inputs.instrument;
        // Tier 3: Custom entry field (e.g. dichlorvosMethod for Trichlorfon/Dichlorvos)
        const d = this.draft();
        if (d?.page1Data?.['dichlorvosMethod'])
            return d.page1Data['dichlorvosMethod'];
        // Tier 4: Default from SOP metadata
        const sopList = this.state.sops();
        const sopObj = sopList.find(s => s.id === r.sopId);
        if (sopObj?.device)
            return sopObj.device;
        // Tier 5: System fallback based on configKey or generic
        const key = this.configKey();
        if (key && key.includes('gcms'))
            return 'GC-MS/MS';
        if (key && key.includes('lcms'))
            return 'LC-MS/MS';
        return 'GC-MS/MS / LC-MS/MS';
    }
    constructor() {
        this.route = inject(ActivatedRoute);
        this.router = inject(Router);
        this.state = inject(StateService);
        this.resultService = inject(ResultService);
        this.toast = inject(ToastService);
        this.sanitizer = inject(DomSanitizer);
        this.masterService = inject(MasterTargetService);
        this.auth = inject(AuthService);
        this.draftFactory = inject(SopDraftFactoryService);
        this.printService = inject(PrintService);
        this.hasUnsavedChangesActivity = false;
        this.previousLockedBy = null;
        this.isReadOnly = computed(() => {
            const d = this.draft();
            const r = this.run();
            const user = this.auth.currentUser();
            if (d?.status === 'completed')
                return true;
            if (r?.lockedBy && user && r.lockedBy.toLowerCase() !== user.email.toLowerCase()) {
                if (r.lastActiveAt) {
                    const lastActive = this.convertToDate(r.lastActiveAt);
                    if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        });
        this.lockedByOthers = computed(() => {
            const r = this.run();
            const user = this.auth.currentUser();
            if (!r?.lockedBy || !user || r.lockedBy.toLowerCase() === user.email.toLowerCase())
                return false;
            if (r.lastActiveAt) {
                const lastActive = this.convertToDate(r.lastActiveAt);
                if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
                    return false;
                }
            }
            return true;
        });
        this.masterTargets = signal([]);
        this.requestId = '';
        this.isLoading = signal(true);
        this.isSavingDraft = signal(false);
        this.isPublishing = signal(false);
        this.isProcessing = computed(() => this.isSavingDraft() || this.isPublishing());
        this.formIsReadOnly = computed(() => this.isReadOnly() || this.isProcessing());
        // Auto-save state
        this.autoSaveStatus = signal('synced');
        this.lastSavedAt = signal(null);
        this.renderDraftForm = signal(true);
        this.draftChangeSubject = new Subject();
        this.autoSaveGeneration = 0;
        this.autoSaveRevision = 0;
        this.lastSavedRevision = 0;
        this.autoSavePaused = false;
        this.autoSaveQueue = Promise.resolve();
        this.completionReconcileChecked = false;
        // Emergency feature toggle for the new modular strategy architecture
        this.ENABLE_MODULAR_SOPS = true;
        // Approved request (run)
        this.run = signal(null);
        // Draft data matching AnalysisResultDraft model
        this.draft = signal(null);
        // SOP configuration matching ANGULAR_SOP_CONFIG keys
        this.config = signal(null);
        // Resolved config key (vd: 'trifluralin-gcms') — dùng để gửi sang GAS
        this.configKey = signal(null);
        // Sub-collection history signal
        this.historyList = signal([]);
        this.showResetModal = signal(false);
        this.showPreflightModal = signal(false);
        this.excelImportFile = signal(null);
        this.preflightSummary = signal(null);
        this.resetConfirmText = signal('');
        this.isMetadataExpanded = signal(false);
        // Actions dropdown toggle (click-based instead of hover)
        this.showActionsMenu = signal(false);
        // Restore Version dropdown toggle (click-based instead of hover)
        this.showRestoreMenu = signal(false);
        // Global Prefix Filtering
        this.activeFilter = signal('ALL');
        this.samplesPerReport = signal(null);
        this.detectedPrefixes = computed(() => {
            const r = this.run();
            if (!r)
                return [];
            const prefixes = new Set();
            // 1. Scan from actual sample list
            (r.sampleList || []).forEach((sample) => {
                const startsWithLetter = /^[a-zA-Z]/.test(sample);
                const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
                prefixes.add(prefix);
            });
            return Array.from(prefixes).sort();
        });
        this.filteredRun = computed(() => {
            const r = this.run();
            if (!r)
                return null;
            const filter = this.activeFilter();
            if (filter === 'ALL')
                return r;
            return {
                ...r,
                sampleList: (r.sampleList || []).filter((sample) => {
                    const startsWithLetter = /^[a-zA-Z]/.test(sample);
                    const prefix = startsWithLetter ? sample.charAt(0).toUpperCase() : '';
                    return prefix === filter;
                })
            };
        });
        this.samplePublishProgress = computed(() => {
            const r = this.run();
            const d = this.draft();
            if (!r || !d)
                return { published: 0, total: 0, percent: 0, unpublishedSamples: [] };
            // Tổng mẫu = TẤT CẢ mẫu thực trong mẻ (loại trừ QC nội bộ như QC_SPIKE, QC_FINAL…)
            // Không lọc theo `selected` để tránh hiển thị sai tiến độ khi đang filter prefix
            const allSamples = (r.sampleList || []).filter((s) => !s.startsWith('QC_'));
            const publishedSamples = new Set();
            const reports = d.reports || {};
            for (const rep of Object.values(reports)) {
                if (rep && (rep.status === 'completed' || rep.pdfUrl)) {
                    (rep.includedSamples || []).forEach((s) => publishedSamples.add(s));
                }
            }
            // Báo cáo chung (non-prefix)
            if (d.pdfUrl) {
                allSamples.forEach((s) => publishedSamples.add(s));
            }
            const publishedCount = allSamples.filter((s) => publishedSamples.has(s)).length;
            const unpublishedSamples = allSamples.filter((s) => !publishedSamples.has(s));
            return {
                published: publishedCount,
                total: allSamples.length,
                percent: allSamples.length > 0 ? Math.round(publishedCount / allSamples.length * 100) : 0,
                unpublishedSamples
            };
        });
        this.publishedSampleSet = computed(() => {
            const progress = this.samplePublishProgress();
            const allSamples = (this.run()?.sampleList || []).filter((s) => !s.startsWith('QC_'));
            const published = new Set(allSamples.filter((s) => !progress.unpublishedSamples.includes(s)));
            return published;
        });
        this.previousDraftStatus = null;
        this.formatSampleList = formatSampleList;
        this.getSafeGoogleUrl = getSafeGoogleUrl;
        // getAll() có timeout để UI không bị treo, nhưng DeltaSync có thể trả dữ liệu
        // sau timeout đó. Luôn đồng bộ signal sống để import Excel không giữ mãi
        // danh mục Master Analyte rỗng của lần tải đầu.
        effect(() => {
            const targets = this.masterService.analytes();
            if (targets.length > 0) {
                this.masterTargets.set(targets);
            }
        });
        effect(() => {
            const prefixes = this.detectedPrefixes();
            if (prefixes.length === 1) {
                this.activeFilter.set(prefixes[0]);
            }
        });
        effect(() => {
            const status = this.draft()?.status;
            if (status === 'completed' && this.previousDraftStatus === 'draft') {
                this.toast.show('🔒 Mẻ đã được khoá — Toàn bộ mẫu đã có báo cáo PDF. Dùng "Mở khóa & chỉnh sửa" nếu cần sửa.', 'success');
            }
            this.previousDraftStatus = status || null;
        });
        // Tự động giành khóa một cách phản ứng (Reactive Lock Acquisition)
        effect(() => {
            const user = this.auth.currentUser();
            const runDoc = this.run();
            if (user && runDoc && runDoc.status !== 'completed') {
                const isLockedByMe = runDoc.lockedBy?.toLowerCase() === user.email.toLowerCase();
                let isStale = false;
                if (runDoc.lockedBy && !isLockedByMe && runDoc.lastActiveAt) {
                    const lastActive = this.convertToDate(runDoc.lastActiveAt);
                    if (lastActive && (new Date().getTime() - lastActive.getTime()) > 3 * 60 * 1000) {
                        isStale = true;
                    }
                }
                if (!runDoc.lockedBy || isStale) {
                    this.resultService.acquireLock(this.requestId, user.email, user.displayName);
                }
            }
        });
    }
    ngOnInit() {
        this.requestId = this.route.snapshot.paramMap.get('id') || '';
        if (!this.requestId) {
            this.toast.show('Không tìm thấy ID mẻ chạy!', 'error');
            this.router.navigate(['/results']);
            return;
        }
        // Gom thao tác nhập nhanh, sau đó xếp hàng tuần tự để không có request cũ
        // hoàn tất sau request mới và ghi đè dữ liệu/trạng thái.
        this.autoSaveSub = this.draftChangeSubject.pipe(debounceTime(1500)).subscribe((envelope) => {
            this.autoSaveQueue = this.autoSaveQueue.then(() => this.performAutoSave(envelope));
        });
        // Cập nhật heartbeat định kỳ để cập nhật lastActiveAt (Optimized 1 - Throttled)
        this.heartbeatInterval = setInterval(async () => {
            const r = this.run();
            const user = this.auth.currentUser();
            if (r && user && r.lockedBy === user.email && this.hasUnsavedChangesActivity) {
                this.hasUnsavedChangesActivity = false;
                await this.resultService.updateHeartbeat(this.requestId);
            }
        }, 60000);
        // Read prefix from route query params
        this.route.queryParams.subscribe(params => {
            if (params['prefix'] !== undefined) {
                this.activeFilter.set(params['prefix']);
            }
        });
        this.isLoading.set(true);
        // Subscribe to real-time changes of the request document
        this.unsubscribeFromDraft = this.resultService.subscribeToDraft(this.requestId, async (draftDoc, runDoc) => {
            if (runDoc) {
                const user = this.auth.currentUser();
                // Phát hiện bị giành khóa chỉnh sửa (Take Over - Optimized 2)
                if (this.previousLockedBy && user && this.previousLockedBy === user.email && runDoc.lockedBy && runDoc.lockedBy !== user.email) {
                    this.toast.show(`Quyền chỉnh sửa mẻ này đã bị giành bởi ${runDoc.lockedByName || 'người dùng khác'}. Trạng thái của bạn chuyển về Chỉ xem.`, 'warning');
                    // Lưu backup cục bộ phần thay đổi chưa kịp lưu
                    if (this.draft()) {
                        try {
                            localStorage.setItem(`backup_draft_${user.email}_${this.requestId}`, JSON.stringify(this.draft()));
                            console.log('[Locking] Unsaved changes backed up to localStorage');
                        }
                        catch (e) {
                            console.warn('[Locking] Local backup write failed', e);
                        }
                    }
                }
                this.previousLockedBy = runDoc.lockedBy || null;
                this.run.set(runDoc);
                const sopObj = this.state.sops().find((s) => s.id === runDoc.sopId) || null;
                const resolvedKey = resolveConfigKey(runDoc.sopId, runDoc.sopName || '', sopObj);
                const sopConf = resolvedKey ? ANGULAR_SOP_CONFIG[resolvedKey] : null;
                if (sopConf && resolvedKey) {
                    this.config.set({ ...sopConf, id: resolvedKey });
                    this.configKey.set(resolvedKey);
                    if (!draftDoc) {
                        // Nếu chưa có nháp, tạo bản nháp mặc định ban đầu
                        draftDoc = this.createDefaultDraft(runDoc, sopConf);
                    }
                    const explicitEditMode = this.route.snapshot.queryParamMap.get('edit') === '1';
                    if (draftDoc.status === 'completed' && !explicitEditMode) {
                        const queryParams = this.activeFilter() !== 'ALL' ? { prefix: this.activeFilter() } : {};
                        this.router.navigate(['/results-view', this.requestId], { queryParams, replaceUrl: true });
                        return;
                    }
                    // Cập nhật draft signal thời gian thực
                    // Chỉ cập nhật nếu đang loading lần đầu hoặc không có thay đổi chưa lưu
                    // để tránh overwrite các giá trị đã được onSopSpecificInit() khởi tạo
                    // nhưng chưa kịp auto-save vào Firestore
                    if (this.isLoading() || this.autoSaveStatus() === 'synced') {
                        this.draft.set(draftDoc);
                    }
                    // Tự chữa các mẻ cũ đã in đủ 100% nhưng bị autosave kéo ngược về draft.
                    if (!this.completionReconcileChecked && draftDoc.status !== 'completed') {
                        this.completionReconcileChecked = true;
                        void this.resultService.reconcileCompletionStatus(this.requestId, draftDoc, runDoc.sampleList || [], runDoc.resultStatusReason);
                    }
                }
            }
            this.isLoading.set(false);
        });
        // Load Master Targets
        this.masterService.getAll().then(targets => {
            this.masterTargets.set(targets);
        });
        // Tải lịch sử in
        this.loadHistory();
    }
    async loadHistory() {
        const hist = await this.resultService.getHistory(this.requestId);
        this.historyList.set(hist);
    }
    ngOnDestroy() {
        if (this.unsubscribeFromDraft) {
            this.unsubscribeFromDraft();
        }
        if (this.autoSaveSub) {
            this.autoSaveSub.unsubscribe();
        }
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        // Giải phóng khóa khi thoát trang nếu mình là người giữ khóa
        const r = this.run();
        const user = this.auth.currentUser();
        if (r && user && r.lockedBy === user.email) {
            this.resultService.releaseLock(this.requestId);
        }
    }
    onDraftChanged(updatedDraft) {
        if (this.formIsReadOnly())
            return;
        // Tạo shallow copy để Angular signal luôn nhận new reference,
        // đảm bảo signal trigger change detection ngay cả khi child emit
        // cùng object reference (e.g., sau onSopSpecificInit trong ngOnInit).
        this.draft.set({ ...updatedDraft });
        if (this.autoSavePaused)
            return;
        const revision = ++this.autoSaveRevision;
        this.autoSaveStatus.set('modified');
        this.draftChangeSubject.next({
            draft: this.cloneDraft(updatedDraft),
            generation: this.autoSaveGeneration,
            revision
        });
    }
    /**
     * Lưu nháp thủ công (Force manual save)
     */
    async triggerSaveDraft() {
        if (!this.draft() || this.isProcessing())
            return;
        this.isSavingDraft.set(true);
        try {
            const success = await this.flushCurrentDraft(true);
            if (success) {
                this.toast.show('Đã lưu bản nháp kết quả phân tích thành công!', 'success');
            }
        }
        finally {
            this.resumeAutoSave();
            this.isSavingDraft.set(false);
        }
    }
    openExcelImport(file) {
        if (this.formIsReadOnly())
            return;
        this.closeActionsMenu();
        this.excelImportFile.set(file);
    }
    closeExcelImport() {
        this.excelImportFile.set(null);
    }
    onExcelImportApplied(event) {
        this.onDraftChanged(event.draft);
        this.excelImportFile.set(null);
        this.toast.show(event.originalFileSaved
            ? `Đã áp dụng ${event.appliedCount} thông tin và lưu tệp Excel gốc ${event.originalFileName || ''}. Dữ liệu đang được tự động lưu.`
            : `Đã áp dụng ${event.appliedCount} thông tin từ Excel. Dữ liệu đang được tự động lưu.`, 'success');
    }
    /**
     * Giành quyền chỉnh sửa mẻ chạy (Take Over)
     */
    async takeOverLock() {
        const user = this.auth.currentUser();
        const run = this.run();
        if (!user || !run)
            return;
        const confirmed = confirm(`Bạn có chắc chắn muốn giành quyền chỉnh sửa mẻ này?\nThao tác này sẽ chuyển màn hình của ${run.lockedByName || 'người khác'} về chế độ Chỉ xem. Dữ liệu chưa lưu của họ có thể bị mất.`);
        if (confirmed) {
            this.isLoading.set(true);
            await this.resultService.acquireLock(this.requestId, user.email, user.displayName);
            this.isLoading.set(false);
            this.toast.show('Bạn đã giành quyền chỉnh sửa mẻ này thành công!', 'success');
        }
    }
    /**
     * Phục hồi bản in trước đó (Fallback backup)
     */
    async restoreBackup() {
        this.isSavingDraft.set(true);
        const restored = await this.resultService.restoreFromBackup(this.requestId);
        if (restored) {
            this.draft.set(restored);
        }
        this.isSavingDraft.set(false);
    }
    /**
     * Khôi phục số liệu từ một phiên bản cụ thể
     */
    async restoreFromVersion(version, prefix, reportId) {
        if (this.isProcessing())
            return;
        const displayName = prefix && prefix !== 'ALL' ? (prefix === '_NO_PREFIX_' ? ' (Không tiền tố)' : ` (${prefix})`) : '';
        const confirmed = confirm(`Bạn có chắc chắn muốn khôi phục số liệu nhập liệu của bản v${version}${displayName}? Dữ liệu chưa lưu hiện tại sẽ bị ghi đè.`);
        if (!confirmed)
            return;
        this.closeRestoreMenu();
        this.isSavingDraft.set(true);
        const restored = await this.resultService.restoreFromVersion(this.requestId, version, prefix, reportId);
        if (restored) {
            this.draft.set(restored);
            // Reload lịch sử
            const hist = await this.resultService.getHistory(this.requestId);
            this.historyList.set(hist);
        }
        this.isSavingDraft.set(false);
    }
    /**
     * Xuất bản kết quả -> Tạo tệp PDF
     */
    async triggerPublishReport(skipPreflight = false) {
        if (this.isPublishing())
            return;
        const currentRun = this.run();
        const currentDraft = this.draft();
        const currentConf = this.config();
        if (!currentRun || !currentDraft || !currentConf)
            return;
        if (this.isReadOnly()) {
            if (currentDraft.status !== 'completed') {
                this.toast.show('Mẻ chạy đang bị khóa bởi người khác, không thể xuất báo cáo mới!', 'error');
                return;
            }
        }
        const preflight = buildPublishPreflightSummary({
            run: currentRun,
            draft: currentDraft,
            config: currentConf,
            configKey: this.configKey(),
            activeFilter: this.activeFilter(),
            samplesPerReport: this.samplesPerReport(),
            unpublishedSamples: this.samplePublishProgress().unpublishedSamples
        });
        if (!skipPreflight) {
            this.preflightSummary.set(preflight);
            this.showPreflightModal.set(true);
            return;
        }
        if (preflight.blockers.length > 0) {
            this.preflightSummary.set(preflight);
            this.showPreflightModal.set(true);
            this.toast.show('Cần xử lý các lỗi bắt buộc trước khi tạo báo cáo.', 'error');
            return;
        }
        this.isPublishing.set(true);
        try {
            // Chờ mọi autosave cũ kết thúc và lưu snapshot mới nhất trước khi tạo PDF.
            // Autosave tiếp tục bị tạm dừng cho đến khi publish hoàn tất.
            const flushed = await this.flushCurrentDraft(false);
            if (!flushed) {
                this.toast.show('Không thể lưu dữ liệu mới nhất. Đã dừng xuất báo cáo để tránh tạo PDF sai.', 'error');
                return;
            }
            const activeFilter = this.activeFilter();
            const key = this.configKey();
            // 1. Get all included samples based on activeFilter
            const allIncludedSamples = (currentRun.sampleList || []).filter((s) => {
                const resObj = currentDraft.resultData[s] || {};
                const startsWithLetter = /^[a-zA-Z]/.test(s);
                const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
                const isSelected = resObj['selected'] !== false;
                const matchesFilter = activeFilter === 'ALL' || prefix === activeFilter;
                return isSelected && matchesFilter;
            });
            if (allIncludedSamples.length === 0) {
                this.toast.show('Vui lòng chọn ít nhất một mẫu để tạo báo cáo!', 'info');
                this.isPublishing.set(false);
                return;
            }
            // 2. Chunking
            const chunkSize = this.samplesPerReport() || allIncludedSamples.length;
            const chunks = [];
            for (let i = 0; i < allIncludedSamples.length; i += chunkSize) {
                chunks.push(allIncludedSamples.slice(i, i + chunkSize));
            }
            let lastResult = null;
            // 3. Process each chunk
            for (const chunk of chunks) {
                // Clone draft and set selected=false for non-chunk samples
                const chunkDraft = JSON.parse(JSON.stringify(currentDraft));
                (currentRun.sampleList || []).forEach((s) => {
                    if (!chunk.includes(s)) {
                        if (!chunkDraft.resultData[s])
                            chunkDraft.resultData[s] = {};
                        chunkDraft.resultData[s].selected = false;
                    }
                });
                // SOP TBVTV Thực Phẩm: maHoSo = danh sách mẫu trong chunk
                // Nếu user chưa nhập (trống) → tự động điền; nếu đã nhập → giữ nguyên khi 1 chunk
                // Khi có nhiều chunk (tách phiếu) → luôn override để đúng với mỗi phiếu
                if (key === 'tbvtv-thuc-pham-gcmsms' && chunk.length > 0) {
                    if (!chunkDraft.page1Data)
                        chunkDraft.page1Data = {};
                    const currentMaHoSo = chunkDraft.page1Data['maHoSo'] || '';
                    if (chunks.length > 1 || !currentMaHoSo.trim()) {
                        chunkDraft.page1Data['maHoSo'] = chunk.join(', ');
                    }
                }
                let prefixForReport = activeFilter === 'ALL' ? 'ALL' : activeFilter;
                if (activeFilter === 'ALL' && chunk.length > 0) {
                    const detectedPrefixes = new Set();
                    chunk.forEach((s) => {
                        const startsWithLetter = /^[a-zA-Z]/.test(s);
                        detectedPrefixes.add(startsWithLetter ? s.charAt(0).toUpperCase() : '');
                    });
                    if (detectedPrefixes.size === 1) {
                        prefixForReport = Array.from(detectedPrefixes)[0];
                    }
                }
                let reportPayload = null;
                if (key === 'trifluralin-gcms') {
                    reportPayload = buildTrifluralinPdfPayload(chunkDraft, currentRun, activeFilter, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
                }
                else if (key === 'tbvtv-thuc-pham-gcmsms') {
                    const isRutGon = chunkDraft.page1Data['printFormType'] === 'formRutGon';
                    if (isRutGon) {
                        const shortConf = { ...ANGULAR_SOP_CONFIG['tbvtv-thuc-pham-gcmsms-rut-gon'], id: 'tbvtv-thuc-pham-gcmsms-rut-gon' };
                        reportPayload = buildFipronilPdfPayload(chunkDraft, currentRun, activeFilter, shortConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
                        reportPayload.sopId = 'tbvtv-thuc-pham-gcmsms-rut-gon';
                        reportPayload.metadata = { ...reportPayload.metadata, printFormType: 'formRutGon', sourceSopId: chunkDraft.sopId || currentRun.sopId, templateDocId: SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formRutGon, templateDocUrl: SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formRutGon };
                    }
                    else {
                        reportPayload = buildUnifiedType3bPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
                        reportPayload.metadata = { ...reportPayload.metadata, printFormType: 'formDayDu', templateDocId: SOP914_TBVTV_THUC_PHAM_TEMPLATE_DOC_IDS.formDayDu, templateDocUrl: SOP914_TBVTV_THUC_PHAM_TEMPLATE_URLS.formDayDu };
                    }
                }
                else if (key === 'lan-huu-co' || key === 'chlor-huu-co' || key === 'nhom-cuc' || key === 'nhom-i' || currentConf.formType === 'type3b') {
                    reportPayload = buildUnifiedType3bPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
                }
                else if (key === 'fipronil-chlorpyrifos') {
                    reportPayload = buildFipronilPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
                }
                else if (key === 'dichlorvos-gcms') {
                    reportPayload = buildDichlorvosPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
                }
                else if (key === 'chloroform-gcms') {
                    reportPayload = buildChloroformPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this));
                }
                else {
                    reportPayload = buildDefaultSopPdfPayload(chunkDraft, currentRun, activeFilter, currentConf, this.formatAnalysisDate.bind(this), this.getRunDate.bind(this), this.masterTargets());
                }
                // Tách dữ liệu dùng để build PDF (chunkDraft, có selected=false cho các mẫu ngoài chunk)
                // khỏi dữ liệu lưu xuống Firestore (draftForSave, giữ nguyên selected gốc của mọi mẫu).
                // Chỉ kế thừa page1Data từ chunkDraft (có thể đã sửa maHoSo) để phản ánh đúng tên hồ sơ.
                const draftForSave = {
                    ...currentDraft,
                    page1Data: { ...(chunkDraft.page1Data || currentDraft.page1Data) }
                };
                const result = await this.resultService.publishReport(this.requestId, draftForSave, reportPayload, prefixForReport, chunk);
                lastResult = result;
            }
            if (lastResult && lastResult.success) {
                this.draft.update((d) => d ? { ...d, status: lastResult.newStatus || 'completed', version: (d.version || 0) + 1 } : null);
                this.lastSavedAt.set(new Date());
                this.autoSaveStatus.set('synced');
                const hist = await this.resultService.getHistory(this.requestId);
                this.historyList.set(hist);
                const url = lastResult.pdfViewUrl || lastResult.pdfUrl;
                if (url) {
                    this.openPdfPreview(url, lastResult.docsUrl, lastResult.version, lastResult.publishedBy, lastResult.publishedAt, lastResult.prefix);
                }
                else {
                    this.toast.show('PDF đã lưu trên Drive nhưng không nhận được liên kết trực tiếp.', 'info');
                }
            }
        }
        finally {
            this.resumeAutoSave();
            this.isPublishing.set(false);
        }
    }
    closePreflightModal() {
        this.showPreflightModal.set(false);
    }
    async confirmPublishAfterPreflight() {
        const summary = this.preflightSummary();
        if (summary?.blockers.length)
            return;
        this.showPreflightModal.set(false);
        await this.triggerPublishReport(true);
    }
    /**
     * Hủy xuất bản kết quả (Mở khóa chỉnh sửa)
     */
    async triggerUnlockToEdit() {
        if (this.isProcessing())
            return;
        const confirmed = confirm('Bạn có chắc chắn muốn mở khóa mẻ chạy này để chỉnh sửa?\nSau khi chỉnh sửa xong, lần xuất bản tiếp theo sẽ tạo ra một bản báo cáo phiên bản mới (tăng 1 version) mà không xóa bản cũ.');
        if (!confirmed)
            return;
        this.isSavingDraft.set(true);
        try {
            const updated = await this.resultService.unlockToEdit(this.requestId);
            if (updated) {
                this.draft.set(updated);
                // Reload lịch sử
                const hist = await this.resultService.getHistory(this.requestId);
                this.historyList.set(hist);
            }
        }
        finally {
            this.isSavingDraft.set(false);
        }
    }
    // Reset results modal actions
    openResetModal() {
        this.resetConfirmText.set('');
        this.showResetModal.set(true);
    }
    closeResetModal() {
        this.showResetModal.set(false);
        this.resetConfirmText.set('');
    }
    onResetConfirmInput(event) {
        const val = event.target.value;
        this.resetConfirmText.set(val);
    }
    async triggerResetResults() {
        if (this.resetConfirmText() !== 'XÓA' || this.isProcessing())
            return;
        const run = this.run();
        const config = this.config();
        if (!run || !config)
            return;
        this.showResetModal.set(false);
        this.isSavingDraft.set(true);
        try {
            // Chặn mọi request autosave cũ trước khi reset. Nếu không, một request chậm
            // có thể merge ngược số liệu vừa xóa vào document mới.
            await this.pauseAutoSave();
            const freshDraft = this.createDefaultDraft(run, config);
            const updated = await this.resultService.resetResults(this.requestId, freshDraft);
            if (updated) {
                // Remount component SOP để các hook khởi tạo chuyên biệt chạy đúng như
                // lần đầu mở mẻ (loại mẫu, khối lượng, form in, vial, QC...).
                this.renderDraftForm.set(false);
                this.draft.set(updated);
                this.autoSaveRevision = 0;
                this.lastSavedRevision = 0;
                this.lastSavedAt.set(new Date());
                this.autoSaveStatus.set('synced');
                await Promise.resolve();
                // Mở autosave trước khi remount để mọi mặc định bổ sung từ hook ngOnInit
                // của SOP cũng được ghi lại, không chỉ tồn tại tạm thời trên giao diện.
                this.resumeAutoSave();
                this.renderDraftForm.set(true);
                // Reload lịch sử
                const hist = await this.resultService.getHistory(this.requestId);
                this.historyList.set(hist);
            }
        }
        finally {
            this.resumeAutoSave();
            this.isSavingDraft.set(false);
            this.resetConfirmText.set('');
        }
    }
    async triggerDeleteVirtualMaster() {
        if (!this.run()?.isVirtualMaster || this.isProcessing())
            return;
        // Yêu cầu confirm
        if (!confirm('Bạn có chắc chắn muốn gỡ gộp và xóa mẻ tổng hợp này không?\nDữ liệu kết quả mẫu đã nhập sẽ vẫn được giữ nguyên ở các mẻ con.')) {
            return;
        }
        this.isSavingDraft.set(true);
        try {
            const success = await this.resultService.deleteVirtualMaster(this.requestId);
            if (success) {
                // Điều hướng về dashboard kết quả
                this.router.navigate(['/results']);
            }
        }
        finally {
            this.isSavingDraft.set(false);
        }
    }
    findReportForFilter(activeFilter) {
        const d = this.draft();
        const r = this.run();
        if (!d || activeFilter === 'ALL')
            return null;
        const prefixKey = activeFilter === '' ? '_NO_PREFIX_' : activeFilter;
        // Compute current included samples for this filter to match exactly if possible
        const currentRun = r;
        const currentDraft = d;
        const includedSamples = (currentRun?.sampleList || []).filter((s) => {
            const resObj = currentDraft?.resultData?.[s] || {};
            const startsWithLetter = /^[a-zA-Z]/.test(s);
            const prefix = startsWithLetter ? s.charAt(0).toUpperCase() : '';
            const isSelected = resObj['selected'] !== false;
            return isSelected && prefix === activeFilter;
        });
        const sortedCurrent = [...includedSamples].sort().join(',');
        const findInReports = (reportsObj) => {
            if (!reportsObj)
                return null;
            const candidates = Object.entries(reportsObj).map(([key, rep]) => {
                if (!rep)
                    return null;
                const repPrefix = rep.prefix || key;
                return { ...rep, repPrefix, originalKey: key };
            }).filter((rep) => {
                return rep && rep.repPrefix === prefixKey;
            });
            if (candidates.length === 0)
                return null;
            // 1. Try to find exact match on includedSamples
            const exactMatch = candidates.find((rep) => {
                const repSamples = [...(rep.includedSamples || [])].sort().join(',');
                return repSamples === sortedCurrent;
            });
            if (exactMatch)
                return exactMatch;
            // 2. Fallback to the latest report for this prefix
            candidates.sort((a, b) => {
                const valA = a.version || 0;
                const valB = b.version || 0;
                return valB - valA;
            });
            return candidates[0];
        };
        const draftReport = findInReports(d.reports);
        if (draftReport && (draftReport.pdfUrl || draftReport.pdfViewUrl || draftReport.docsUrl)) {
            return draftReport;
        }
        const runReports = r?.analysisResultSummary?.reports || r?.analysisResult?.reports;
        const runReport = findInReports(runReports);
        if (runReport && (runReport.pdfUrl || runReport.pdfViewUrl || runReport.docsUrl)) {
            return runReport;
        }
        return null;
    }
    getPrintButtonLabel() {
        const activeFilter = this.activeFilter();
        if (activeFilter === 'ALL') {
            const v = (this.draft()?.version || 0) + 1;
            return `Tạo & In bản v${v} (Tất cả mẫu)`;
        }
        const reportForFilter = this.findReportForFilter(activeFilter) || {};
        const v = (reportForFilter.version || 0) + 1;
        const filterName = activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`;
        return `Tạo & In bản v${v} (${filterName})`;
    }
    getCurrentPdfUrl() {
        const activeFilter = this.activeFilter();
        let url = null;
        const d = this.draft();
        const r = this.run();
        if (!d)
            return null;
        if (activeFilter === 'ALL') {
            url = d.pdfViewUrl || d.pdfUrl || null;
            if (!url && r) {
                url = r.analysisResultSummary?.pdfViewUrl || r.analysisResultSummary?.pdfUrl || r.analysisResult?.pdfViewUrl || r.analysisResult?.pdfUrl || null;
            }
        }
        else {
            const reportForFilter = this.findReportForFilter(activeFilter) || {};
            url = reportForFilter.pdfViewUrl || reportForFilter.pdfUrl || null;
        }
        return getSafeGoogleUrl(url, 'pdf');
    }
    getRunDate() {
        const run = this.run();
        const today = timestampToLocalDateKey(new Date()) || '';
        if (!run)
            return today;
        if (run.analysisDate)
            return run.analysisDate;
        return timestampToLocalDateKey(run.approvedAt ?? run.timestamp) || today;
    }
    getCurrentDocsUrl() {
        const activeFilter = this.activeFilter();
        let url = null;
        const d = this.draft();
        const r = this.run();
        if (!d)
            return null;
        if (activeFilter === 'ALL') {
            url = d.docsUrl || null;
            if (!url && r) {
                url = r.analysisResultSummary?.docsUrl || r.analysisResult?.docsUrl || null;
            }
        }
        else {
            const reportForFilter = this.findReportForFilter(activeFilter) || {};
            url = reportForFilter.docsUrl || null;
        }
        return getSafeGoogleUrl(url, 'doc');
    }
    hasAnyActiveReports() {
        const d = this.draft();
        const r = this.run();
        if (!d || !r)
            return false;
        if (d.pdfUrl || d.pdfViewUrl || d.docsUrl || r.analysisResultSummary?.pdfUrl || r.analysisResultSummary?.pdfViewUrl || r.analysisResult?.pdfUrl || r.analysisResult?.pdfViewUrl)
            return true;
        const reports = d.reports || {};
        if (Object.values(reports).some((rep) => rep && (rep.pdfUrl || rep.pdfViewUrl || rep.docsUrl)))
            return true;
        const runReports = r.analysisResultSummary?.reports || r.analysisResult?.reports || {};
        return Object.values(runReports).some((rep) => rep && (rep.pdfUrl || rep.pdfViewUrl || rep.docsUrl));
    }
    getPrefixReport(prefix) {
        return this.findReportForFilter(prefix);
    }
    /**
     * Trả về TẤT CẢ các báo cáo (chunks) thuộc một prefix,
     * bao gồm cả trường hợp tách phiếu nhiều chunk cùng tiền tố.
     * Sắp xếp theo thời gian tạo (cũ → mới).
     */
    getAllReportsForPrefix(prefix) {
        const d = this.draft();
        const r = this.run();
        const prefixKey = prefix === '' ? '_NO_PREFIX_' : prefix;
        const extractFromReports = (reportsObj) => {
            if (!reportsObj)
                return [];
            return Object.values(reportsObj)
                .filter((rep) => rep && (rep.prefix || '') === prefixKey && (rep.pdfUrl || rep.pdfViewUrl || rep.docsUrl))
                .sort((a, b) => {
                // Sort by creation time ascending
                const ta = a.pdfCreatedAt || '';
                const tb = b.pdfCreatedAt || '';
                return ta.localeCompare(tb);
            });
        };
        const draftReports = extractFromReports(d?.reports);
        if (draftReports.length > 0)
            return draftReports;
        const runReports = r?.analysisResultSummary?.reports || r?.analysisResult?.reports;
        return extractFromReports(runReports);
    }
    getGeneralReport() {
        const d = this.draft();
        const r = this.run();
        // Ưu tiên draft nếu có
        if (d && (d.pdfUrl || d.pdfViewUrl || d.docsUrl)) {
            return {
                version: d.version,
                publishedBy: d.updatedBy,
                pdfUrl: d.pdfUrl,
                pdfViewUrl: d.pdfViewUrl,
                docsUrl: d.docsUrl
            };
        }
        // Lấy từ run
        if (r) {
            const sum = r.analysisResultSummary || r.analysisResult;
            if (sum && (sum.pdfUrl || sum.pdfViewUrl || sum.docsUrl)) {
                return {
                    version: sum.version || d?.version || 1,
                    publishedBy: sum.updatedBy || sum.publishedBy || 'System',
                    pdfUrl: sum.pdfUrl,
                    pdfViewUrl: sum.pdfViewUrl,
                    docsUrl: sum.docsUrl
                };
            }
        }
        return null;
    }
    openUrl(url) {
        if (url)
            openInNewTab(url);
    }
    cloneDraft(draft) {
        return JSON.parse(JSON.stringify(draft));
    }
    createDefaultDraft(runDoc, sopConf) {
        return this.draftFactory.createInitialDraft(runDoc, sopConf, {
            requestId: this.requestId,
            updatedBy: this.auth.currentUser()?.displayName || 'System',
            masterTargets: this.masterTargets()
        });
    }
    async performAutoSave(envelope) {
        if (this.autoSavePaused
            || envelope.generation !== this.autoSaveGeneration
            || envelope.revision <= this.lastSavedRevision) {
            return;
        }
        const run = this.run();
        const user = this.auth.currentUser();
        const isLockedByOthers = run?.lockedBy && user
            && run.lockedBy.toLowerCase() !== user.email.toLowerCase();
        if (isLockedByOthers)
            return;
        this.autoSaveStatus.set('saving');
        const success = await this.resultService.saveDraft(this.requestId, envelope.draft, false, false);
        // Một thao tác reset/publish có thể đã bắt đầu trong lúc request đang chạy.
        if (envelope.generation !== this.autoSaveGeneration)
            return;
        if (success) {
            this.lastSavedRevision = Math.max(this.lastSavedRevision, envelope.revision);
            this.lastSavedAt.set(new Date());
            this.autoSaveStatus.set(this.autoSaveRevision <= this.lastSavedRevision ? 'synced' : 'modified');
        }
        else {
            this.autoSaveStatus.set('error');
        }
    }
    async pauseAutoSave() {
        this.autoSavePaused = true;
        this.autoSaveGeneration++;
        await this.autoSaveQueue;
    }
    resumeAutoSave() {
        this.autoSavePaused = false;
    }
    async flushCurrentDraft(isManualSave) {
        const currentDraft = this.draft();
        if (!currentDraft)
            return false;
        await this.pauseAutoSave();
        this.autoSaveStatus.set('saving');
        const success = await this.resultService.saveDraft(this.requestId, this.cloneDraft(currentDraft), isManualSave, false);
        if (success) {
            this.lastSavedRevision = this.autoSaveRevision;
            this.lastSavedAt.set(new Date());
            this.autoSaveStatus.set('synced');
        }
        else {
            this.autoSaveStatus.set('error');
        }
        return success;
    }
    formatAnalysisDate(dateStr) {
        if (!dateStr)
            return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    }
    goBack() {
        this.router.navigate(['/results']);
    }
    openPdfPreview(pdfUrl, docsUrl, versionOverride, analystOverride, publishDateOverride, prefixOverride) {
        if (!pdfUrl)
            return;
        const activeFilter = prefixOverride === 'ALL' || prefixOverride === undefined
            ? this.activeFilter()
            : (prefixOverride === '_NO_PREFIX_' ? '' : prefixOverride);
        const filterName = activeFilter === 'ALL' ? 'Tất cả mẫu' : (activeFilter === '' ? 'Không tiền tố' : `Nhóm ${activeFilter}`);
        const previewUrl = getGoogleDrivePreviewUrl(pdfUrl);
        const docPreviewUrl = docsUrl ? getGoogleDrivePreviewUrl(docsUrl) : undefined;
        this.printService.openPdfPreview(previewUrl, `Báo cáo kết quả — ${this.run()?.sopName || ''} (${filterName})`, versionOverride ?? this.draft()?.version ?? 1, analystOverride ?? this.draft()?.updatedBy ?? 'Chưa rõ', publishDateOverride ?? this.draft()?.updatedAt, async () => {
            await this.triggerPublishReport();
        }, 'iframe', docPreviewUrl);
    }
    static { this.ɵfac = function ResultEntryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ResultEntryComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ResultEntryComponent, selectors: [["app-result-entry"]], hostBindings: function ResultEntryComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keyup", function ResultEntryComponent_keyup_HostBindingHandler() { return ctx.onUserActivity(); }, false, i0.ɵɵresolveDocument)("click", function ResultEntryComponent_click_HostBindingHandler() { return ctx.onUserActivity(); }, false, i0.ɵɵresolveDocument)("beforeunload", function ResultEntryComponent_beforeunload_HostBindingHandler($event) { return ctx.unloadNotification($event); }, false, i0.ɵɵresolveWindow)("unload", function ResultEntryComponent_unload_HostBindingHandler() { return ctx.onUnload(); }, false, i0.ɵɵresolveWindow);
        } }, decls: 9, vars: 19, consts: [[1, "h-full", "flex", "flex-col", "fade-in"], [3, "goBack", "saveDraft", "publishReport", "unlockToEdit", "openResetModal", "deleteVirtualMaster", "openPdf", "restoreVersion", "samplesPerReportChange", "toggleRestoreMenu", "closeRestoreMenu", "toggleActionsMenu", "closeActionsMenu", "importExcel", "run", "draft", "historyList", "autoSaveStatus", "lastSavedAt", "hasExistingReport", "isProcessing", "isPublishing", "isReadOnly", "showRestoreMenu", "showActionsMenu", "samplesPerReport", "currentPdfUrl", "currentDocsUrl", "printButtonLabel"], [1, "flex-1", "min-h-0", "overflow-y-auto", "custom-scrollbar", "p-6", "bg-slate-50/50", "dark:bg-slate-950/20"], [1, "bg-white", "dark:bg-slate-800", "rounded-2xl", "p-6", "border", "border-slate-200", "dark:border-slate-700", "space-y-6"], [1, "text-center", "py-20", "bg-white", "dark:bg-slate-800", "rounded-3xl", "border", "border-slate-200", "dark:border-slate-700", "border-dashed"], [3, "file", "run", "draft", "config", "configKey", "masterTargets", "isReadOnly"], [1, "fixed", "inset-0", "bg-slate-900/60", "backdrop-blur-sm", "flex", "items-center", "justify-center", "z-50", "p-4"], [1, "flex", "justify-between", "items-center"], ["width", "180px", "height", "24px"], ["width", "120px", "height", "36px"], [1, "space-y-3"], ["width", "100%", "height", "40px"], [3, "takeOverLock", "unlockToEdit", "lockedByOthers", "lockerName", "lockedAt", "lastActiveAt", "isCompleted", "sampleTotal", "completedBy", "completedAt"], [3, "toggleExpand", "run", "isExpanded", "displayDevice", "formatSampleListFn", "formatAnalysisDateFn"], [3, "openPdf", "hasAnyReports", "generalReport", "prefixes", "getAllReportsForPrefixFn", "draftStatus", "progress", "sampleList", "historyList"], [3, "prefixes", "activeFilter"], [3, "pointer-events-none", "opacity-95"], [3, "filterChange", "prefixes", "activeFilter"], [3, "draftChanged", "configKey", "formType", "run", "draft", "config", "activeFilter", "isReadOnly", "publishedSampleSet"], [1, "w-16", "h-16", "bg-slate-50", "dark:bg-slate-700", "rounded-full", "flex", "items-center", "justify-center", "mx-auto", "mb-4", "text-slate-300", "dark:text-slate-500"], [1, "fa-solid", "fa-triangle-exclamation", "text-3xl", "text-red-500"], [1, "text-slate-500", "dark:text-slate-400", "font-medium", "text-sm"], [1, "mt-4", "px-4", "py-2", "bg-slate-200", "dark:bg-slate-700", "rounded-xl", "text-xs", "font-bold", 3, "click"], [3, "cancelled", "applied", "file", "run", "draft", "config", "configKey", "masterTargets", "isReadOnly"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-3xl", "p-6", "max-w-2xl", "w-full", "shadow-2xl", "animate-in", "fade-in", "zoom-in-95", "duration-200"], [1, "flex", "items-start", "justify-between", "gap-4", "mb-5"], [1, "flex", "items-center", "gap-3"], [1, "w-10", "h-10", "rounded-xl", "bg-indigo-50", "dark:bg-indigo-950/30", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-clipboard-check"], [1, "text-base", "font-black", "text-slate-800", "dark:text-slate-100"], [1, "text-xs", "text-slate-500", "dark:text-slate-400", "mt-0.5"], [1, "w-8", "h-8", "rounded-xl", "hover:bg-slate-100", "dark:hover:bg-slate-700", "text-slate-400", 3, "click"], [1, "fa-solid", "fa-xmark"], [1, "space-y-4", "max-h-[55vh]", "overflow-y-auto", "custom-scrollbar", "pr-1"], [1, "rounded-2xl", "border", "border-red-200", "dark:border-red-900/40", "bg-red-50/70", "dark:bg-red-950/20", "p-4"], [1, "rounded-2xl", "border", "border-amber-200", "dark:border-amber-900/40", "bg-amber-50/70", "dark:bg-amber-950/20", "p-4"], [1, "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "bg-slate-50", "dark:bg-slate-900/40", "p-4"], [1, "rounded-2xl", "border", "border-slate-200", "dark:border-slate-700", "p-4"], [1, "text-xs", "font-black", "text-slate-600", "dark:text-slate-300", "uppercase", "tracking-wider", "mb-2"], [1, "space-y-2"], [1, "flex", "items-start", "gap-2", "text-xs"], [1, "flex", "gap-3", "mt-6"], [1, "flex-1", "py-2.5", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-650", "rounded-xl", "transition", 3, "click"], [1, "flex-1", "py-2.5", "text-xs", "font-black", "text-white", "bg-indigo-600", "hover:bg-indigo-700", "rounded-xl", "transition", "disabled:opacity-40", 3, "click", "disabled"], [1, "text-xs", "font-black", "text-red-700", "dark:text-red-400", "uppercase", "tracking-wider", "mb-2"], [1, "space-y-1.5", "text-xs", "font-semibold", "text-red-650", "dark:text-red-300"], [1, "flex", "gap-2"], [1, "fa-solid", "fa-circle-exclamation", "mt-0.5"], [1, "text-xs", "font-black", "text-amber-700", "dark:text-amber-400", "uppercase", "tracking-wider", "mb-2"], [1, "space-y-1.5", "text-xs", "font-semibold", "text-amber-700", "dark:text-amber-300"], [1, "fa-solid", "fa-triangle-exclamation", "mt-0.5"], [1, "space-y-1.5", "text-xs", "font-semibold", "text-slate-500", "dark:text-slate-400"], [1, "fa-solid", "fa-circle-info", "mt-0.5"], [1, "shrink-0", "px-2", "py-0.5", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-950/30", "text-indigo-600", "dark:text-indigo-400", "font-black"], [1, "font-mono", "text-slate-600", "dark:text-slate-300", "break-all"], [1, "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "rounded-3xl", "p-6", "max-w-md", "w-full", "shadow-2xl", "animate-in", "fade-in", "zoom-in-95", "duration-200"], [1, "flex", "items-center", "gap-3", "text-red-600", "dark:text-red-400", "mb-4"], [1, "w-10", "h-10", "rounded-full", "bg-red-50", "dark:bg-red-950/30", "flex", "items-center", "justify-center", "text-lg"], [1, "fa-solid", "fa-triangle-exclamation"], [1, "text-base", "font-bold"], [1, "text-xs", "text-slate-600", "dark:text-slate-300", "mb-4", "leading-relaxed"], [1, "text-red-600", "dark:text-red-400"], [1, "mb-5"], [1, "block", "text-[11px]", "font-semibold", "text-slate-500", "dark:text-slate-400", "mb-2"], [1, "text-red-600", "dark:text-red-400", "font-bold"], ["type", "text", "placeholder", "Nh\u1EADp X\u00D3A \u0111\u1EC3 x\u00E1c nh\u1EADn", 1, "w-full", "px-3", "py-2", "text-xs", "border", "border-slate-200", "dark:border-slate-700", "rounded-xl", "bg-slate-50", "dark:bg-slate-900", "focus:outline-none", "focus:border-red-500", "text-center", "font-bold", "uppercase", "tracking-wider", 3, "input", "value"], [1, "flex", "gap-3"], [1, "flex-1", "py-2", "text-xs", "font-bold", "text-slate-700", "dark:text-slate-200", "bg-slate-100", "dark:bg-slate-700", "hover:bg-slate-200", "dark:hover:bg-slate-650", "rounded-xl", "transition", 3, "click"], [1, "flex-1", "py-2", "text-xs", "font-bold", "text-white", "bg-red-600", "hover:bg-red-700", "rounded-xl", "transition", "disabled:opacity-40", 3, "click", "disabled"]], template: function ResultEntryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "app-result-entry-header", 1);
            i0.ɵɵlistener("goBack", function ResultEntryComponent_Template_app_result_entry_header_goBack_1_listener() { return ctx.goBack(); })("saveDraft", function ResultEntryComponent_Template_app_result_entry_header_saveDraft_1_listener() { return ctx.triggerSaveDraft(); })("publishReport", function ResultEntryComponent_Template_app_result_entry_header_publishReport_1_listener() { return ctx.triggerPublishReport(); })("unlockToEdit", function ResultEntryComponent_Template_app_result_entry_header_unlockToEdit_1_listener() { return ctx.triggerUnlockToEdit(); })("openResetModal", function ResultEntryComponent_Template_app_result_entry_header_openResetModal_1_listener() { return ctx.openResetModal(); })("deleteVirtualMaster", function ResultEntryComponent_Template_app_result_entry_header_deleteVirtualMaster_1_listener() { return ctx.triggerDeleteVirtualMaster(); })("openPdf", function ResultEntryComponent_Template_app_result_entry_header_openPdf_1_listener($event) { return ctx.openPdfPreview($event.pdfUrl, $event.docsUrl); })("restoreVersion", function ResultEntryComponent_Template_app_result_entry_header_restoreVersion_1_listener($event) { return ctx.restoreFromVersion($event.version, $event.prefix, $event.reportId); })("samplesPerReportChange", function ResultEntryComponent_Template_app_result_entry_header_samplesPerReportChange_1_listener($event) { return ctx.samplesPerReport.set($event); })("toggleRestoreMenu", function ResultEntryComponent_Template_app_result_entry_header_toggleRestoreMenu_1_listener() { return ctx.toggleRestoreMenu(); })("closeRestoreMenu", function ResultEntryComponent_Template_app_result_entry_header_closeRestoreMenu_1_listener() { return ctx.closeRestoreMenu(); })("toggleActionsMenu", function ResultEntryComponent_Template_app_result_entry_header_toggleActionsMenu_1_listener() { return ctx.toggleActionsMenu(); })("closeActionsMenu", function ResultEntryComponent_Template_app_result_entry_header_closeActionsMenu_1_listener() { return ctx.closeActionsMenu(); })("importExcel", function ResultEntryComponent_Template_app_result_entry_header_importExcel_1_listener($event) { return ctx.openExcelImport($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "div", 2);
            i0.ɵɵtemplate(3, ResultEntryComponent_Conditional_3_Template, 8, 0, "div", 3)(4, ResultEntryComponent_Conditional_4_Template, 8, 33)(5, ResultEntryComponent_Conditional_5_Template, 7, 0, "div", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(6, ResultEntryComponent_Conditional_6_Template, 1, 7, "app-excel-result-import-modal", 5)(7, ResultEntryComponent_Conditional_7_Template, 28, 6, "div", 6)(8, ResultEntryComponent_Conditional_8_Template, 24, 2, "div", 6);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("run", ctx.run())("draft", ctx.draft())("historyList", ctx.historyList())("autoSaveStatus", ctx.autoSaveStatus())("lastSavedAt", ctx.lastSavedAt())("hasExistingReport", ctx.hasAnyActiveReports())("isProcessing", ctx.isProcessing())("isPublishing", ctx.isPublishing())("isReadOnly", ctx.isReadOnly())("showRestoreMenu", ctx.showRestoreMenu())("showActionsMenu", ctx.showActionsMenu())("samplesPerReport", ctx.samplesPerReport())("currentPdfUrl", ctx.getCurrentPdfUrl())("currentDocsUrl", ctx.getCurrentDocsUrl())("printButtonLabel", ctx.getPrintButtonLabel());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.isLoading() ? 3 : ctx.run() && ctx.draft() && ctx.config() ? 4 : 5);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.excelImportFile() && ctx.run() && ctx.draft() && ctx.config() ? 6 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPreflightModal() && ctx.preflightSummary() ? 7 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showResetModal() ? 8 : -1);
        } }, dependencies: [CommonModule, i1.DatePipe, RouterModule,
            SkeletonComponent,
            // Refactored sub-components
            ResultPrefixTabsComponent,
            ResultRunMetadataComponent,
            ResultEntryStatusBannerComponent,
            ResultActiveReportsPanelComponent,
            ResultEntryHeaderComponent,
            SopEntryOutletComponent,
            ExcelResultImportModalComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ResultEntryComponent, [{
        type: Component,
        args: [{ selector: 'app-result-entry', standalone: true, imports: [
                    CommonModule,
                    RouterModule,
                    SkeletonComponent,
                    // Refactored sub-components
                    ResultPrefixTabsComponent,
                    ResultRunMetadataComponent,
                    ResultEntryStatusBannerComponent,
                    ResultActiveReportsPanelComponent,
                    ResultEntryHeaderComponent,
                    SopEntryOutletComponent,
                    ExcelResultImportModalComponent
                ], template: "<div class=\"h-full flex flex-col fade-in\">\r\n  <!-- Sticky Header -->\r\n  <app-result-entry-header\r\n    [run]=\"run()\"\r\n    [draft]=\"draft()\"\r\n    [historyList]=\"historyList()\"\r\n    [autoSaveStatus]=\"autoSaveStatus()\"\r\n    [lastSavedAt]=\"lastSavedAt()\"\r\n    [hasExistingReport]=\"hasAnyActiveReports()\"\r\n    [isProcessing]=\"isProcessing()\"\r\n    [isPublishing]=\"isPublishing()\"\r\n    [isReadOnly]=\"isReadOnly()\"\r\n    [showRestoreMenu]=\"showRestoreMenu()\"\r\n    [showActionsMenu]=\"showActionsMenu()\"\r\n    [samplesPerReport]=\"samplesPerReport()\"\r\n    [currentPdfUrl]=\"getCurrentPdfUrl()\"\r\n    [currentDocsUrl]=\"getCurrentDocsUrl()\"\r\n    [printButtonLabel]=\"getPrintButtonLabel()\"\r\n    (goBack)=\"goBack()\"\r\n    (saveDraft)=\"triggerSaveDraft()\"\r\n    (publishReport)=\"triggerPublishReport()\"\r\n    (unlockToEdit)=\"triggerUnlockToEdit()\"\r\n    (openResetModal)=\"openResetModal()\"\r\n    (deleteVirtualMaster)=\"triggerDeleteVirtualMaster()\"\r\n    (openPdf)=\"openPdfPreview($event.pdfUrl, $event.docsUrl)\"\r\n    (restoreVersion)=\"restoreFromVersion($event.version, $event.prefix, $event.reportId)\"\r\n    (samplesPerReportChange)=\"samplesPerReport.set($event)\"\r\n    (toggleRestoreMenu)=\"toggleRestoreMenu()\"\r\n    (closeRestoreMenu)=\"closeRestoreMenu()\"\r\n    (toggleActionsMenu)=\"toggleActionsMenu()\"\r\n    (closeActionsMenu)=\"closeActionsMenu()\"\r\n    (importExcel)=\"openExcelImport($event)\">\r\n  </app-result-entry-header>\r\n\r\n  <!-- Main Form Area -->\r\n  <div class=\"flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 dark:bg-slate-950/20\">\r\n    @if (isLoading()) {\r\n      <div class=\"bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6\">\r\n        <div class=\"flex justify-between items-center\">\r\n          <app-skeleton width=\"180px\" height=\"24px\"></app-skeleton>\r\n          <app-skeleton width=\"120px\" height=\"36px\"></app-skeleton>\r\n        </div>\r\n        <div class=\"space-y-3\">\r\n          <app-skeleton width=\"100%\" height=\"40px\"></app-skeleton>\r\n          <app-skeleton width=\"100%\" height=\"40px\"></app-skeleton>\r\n          <app-skeleton width=\"100%\" height=\"40px\"></app-skeleton>\r\n        </div>\r\n      </div>\r\n    } @else if (run() && draft() && config()) {\r\n      <!-- Status Banners (Locked / Completed) -->\r\n      <app-result-entry-status-banner\r\n        [lockedByOthers]=\"lockedByOthers()\"\r\n        [lockerName]=\"run()?.lockedByName || ''\"\r\n        [lockedAt]=\"(convertToDate(run()?.lockedAt) | date: 'HH:mm dd/MM/yyyy') || ''\"\r\n        [lastActiveAt]=\"(convertToDate(run()?.lastActiveAt) | date: 'HH:mm:ss') || ''\"\r\n        [isCompleted]=\"draft()?.status === 'completed'\"\r\n        [sampleTotal]=\"samplePublishProgress().total\"\r\n        [completedBy]=\"draft()?.updatedBy || ''\"\r\n        [completedAt]=\"(convertToDate(draft()?.updatedAt) | date: 'HH:mm dd/MM/yyyy') || ''\"\r\n        (takeOverLock)=\"takeOverLock()\"\r\n        (unlockToEdit)=\"triggerUnlockToEdit()\">\r\n      </app-result-entry-status-banner>\r\n\r\n\r\n      <!-- Run Metadata Banner -->\r\n      <app-result-run-metadata\r\n        [run]=\"run()\"\r\n        [isExpanded]=\"isMetadataExpanded()\"\r\n        [displayDevice]=\"getDisplayDevice()\"\r\n        [formatSampleListFn]=\"formatSampleList\"\r\n        [formatAnalysisDateFn]=\"formatAnalysisDate.bind(this)\"\r\n        (toggleExpand)=\"isMetadataExpanded.set(!isMetadataExpanded())\">\r\n      </app-result-run-metadata>\r\n\r\n\r\n\r\n\r\n      <!-- Active Reports Panel (cards + progress bar) -->\r\n      <app-result-active-reports-panel\r\n        [hasAnyReports]=\"hasAnyActiveReports()\"\r\n        [generalReport]=\"getGeneralReport()\"\r\n        [prefixes]=\"detectedPrefixes()\"\r\n        [getAllReportsForPrefixFn]=\"getAllReportsForPrefix.bind(this)\"\r\n        [draftStatus]=\"draft()?.status || 'draft'\"\r\n        [progress]=\"samplePublishProgress()\"\r\n        [sampleList]=\"run()?.sampleList || []\"\r\n        [historyList]=\"historyList()\"\r\n        (openPdf)=\"openPdfPreview($event.pdfUrl, $event.docsUrl)\">\r\n      </app-result-active-reports-panel>\r\n\r\n\r\n\r\n\r\n\r\n      <!-- Prefix Tabs Filter -->\r\n      @if (detectedPrefixes().length > 1) {\r\n        <app-result-prefix-tabs\r\n          [prefixes]=\"detectedPrefixes()\"\r\n          [activeFilter]=\"activeFilter()\"\r\n          (filterChange)=\"activeFilter.set($event)\">\r\n        </app-result-prefix-tabs>\r\n      }\r\n\r\n\r\n\r\n      @if (renderDraftForm()) {\r\n      <div [class.pointer-events-none]=\"formIsReadOnly()\" [class.opacity-95]=\"formIsReadOnly()\">\r\n      <app-sop-entry-outlet\r\n        [configKey]=\"configKey()\"\r\n        [formType]=\"config()?.formType || null\"\r\n        [run]=\"filteredRun()!\"\r\n        [draft]=\"draft()!\"\r\n        [config]=\"config()!\"\r\n        [activeFilter]=\"activeFilter()\"\r\n        [isReadOnly]=\"formIsReadOnly()\"\r\n        [publishedSampleSet]=\"publishedSampleSet()\"\r\n        (draftChanged)=\"onDraftChanged($event)\">\r\n      </app-sop-entry-outlet>\r\n      </div>\r\n      }\r\n    } @else {\r\n      <div class=\"text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed\">\r\n        <div class=\"w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-500\">\r\n          <i class=\"fa-solid fa-triangle-exclamation text-3xl text-red-500\"></i>\r\n        </div>\r\n        <p class=\"text-slate-500 dark:text-slate-400 font-medium text-sm\">\r\n          Kh\u00F4ng th\u1EC3 t\u00ECm th\u1EA5y m\u1EBB ch\u1EA1y ho\u1EB7c c\u1EA5u h\u00ECnh t\u01B0\u01A1ng \u1EE9ng c\u1EE7a ch\u1EC9 ti\u00EAu n\u00E0y!\r\n        </p>\r\n        <button (click)=\"goBack()\" class=\"mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold\">\r\n          Quay L\u1EA1i Danh S\u00E1ch\r\n        </button>\r\n      </div>\r\n    }\r\n  </div>\r\n\r\n  @if (excelImportFile() && run() && draft() && config()) {\r\n    <app-excel-result-import-modal\r\n      [file]=\"excelImportFile()\"\r\n      [run]=\"run()\"\r\n      [draft]=\"draft()!\"\r\n      [config]=\"config()\"\r\n      [configKey]=\"configKey()\"\r\n      [masterTargets]=\"masterTargets()\"\r\n      [isReadOnly]=\"formIsReadOnly()\"\r\n      (cancelled)=\"closeExcelImport()\"\r\n      (applied)=\"onExcelImportApplied($event)\">\r\n    </app-excel-result-import-modal>\r\n  }\r\n\r\n  <!-- Publish Preflight Modal -->\r\n  @if (showPreflightModal() && preflightSummary()) {\r\n    <div class=\"fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4\">\r\n      <div class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200\">\r\n        <div class=\"flex items-start justify-between gap-4 mb-5\">\r\n          <div class=\"flex items-center gap-3\">\r\n            <div class=\"w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center\">\r\n              <i class=\"fa-solid fa-clipboard-check\"></i>\r\n            </div>\r\n            <div>\r\n              <h3 class=\"text-base font-black text-slate-800 dark:text-slate-100\">Ki\u1EC3m tra tr\u01B0\u1EDBc khi t\u1EA1o b\u00E1o c\u00E1o</h3>\r\n              <p class=\"text-xs text-slate-500 dark:text-slate-400 mt-0.5\">\r\n                {{ preflightSummary()!.includedSamples.length }} m\u1EABu, {{ preflightSummary()!.chunks.length }} phi\u1EBFu d\u1EF1 ki\u1EBFn\r\n              </p>\r\n            </div>\r\n          </div>\r\n          <button (click)=\"closePreflightModal()\" class=\"w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400\">\r\n            <i class=\"fa-solid fa-xmark\"></i>\r\n          </button>\r\n        </div>\r\n\r\n        <div class=\"space-y-4 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1\">\r\n          @if (preflightSummary()!.blockers.length > 0) {\r\n            <div class=\"rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/70 dark:bg-red-950/20 p-4\">\r\n              <div class=\"text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-wider mb-2\">C\u1EA7n x\u1EED l\u00FD tr\u01B0\u1EDBc khi in</div>\r\n              <ul class=\"space-y-1.5 text-xs font-semibold text-red-650 dark:text-red-300\">\r\n                @for (item of preflightSummary()!.blockers; track item) {\r\n                  <li class=\"flex gap-2\"><i class=\"fa-solid fa-circle-exclamation mt-0.5\"></i><span>{{ item }}</span></li>\r\n                }\r\n              </ul>\r\n            </div>\r\n          }\r\n\r\n          @if (preflightSummary()!.warnings.length > 0) {\r\n            <div class=\"rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 p-4\">\r\n              <div class=\"text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2\">C\u1EA3nh b\u00E1o</div>\r\n              <ul class=\"space-y-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300\">\r\n                @for (item of preflightSummary()!.warnings; track item) {\r\n                  <li class=\"flex gap-2\"><i class=\"fa-solid fa-triangle-exclamation mt-0.5\"></i><span>{{ item }}</span></li>\r\n                }\r\n              </ul>\r\n            </div>\r\n          }\r\n\r\n          @if (preflightSummary()!.info.length > 0) {\r\n            <div class=\"rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4\">\r\n              <div class=\"text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2\">Th\u00F4ng tin ph\u1EA1m vi in</div>\r\n              <ul class=\"space-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400\">\r\n                @for (item of preflightSummary()!.info; track item) {\r\n                  <li class=\"flex gap-2\"><i class=\"fa-solid fa-circle-info mt-0.5\"></i><span>{{ item }}</span></li>\r\n                }\r\n              </ul>\r\n            </div>\r\n          }\r\n\r\n          <div class=\"rounded-2xl border border-slate-200 dark:border-slate-700 p-4\">\r\n            <div class=\"text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2\">C\u00E1c phi\u1EBFu s\u1EBD t\u1EA1o</div>\r\n            <div class=\"space-y-2\">\r\n              @for (chunk of preflightSummary()!.chunks; track $index; let idx = $index) {\r\n                <div class=\"flex items-start gap-2 text-xs\">\r\n                  <span class=\"shrink-0 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-black\">Phi\u1EBFu {{ idx + 1 }}</span>\r\n                  <span class=\"font-mono text-slate-600 dark:text-slate-300 break-all\">{{ chunk.join(', ') }}</span>\r\n                </div>\r\n              }\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        <div class=\"flex gap-3 mt-6\">\r\n          <button (click)=\"closePreflightModal()\"\r\n                  class=\"flex-1 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 rounded-xl transition\">\r\n            Quay l\u1EA1i ki\u1EC3m tra\r\n          </button>\r\n          <button (click)=\"confirmPublishAfterPreflight()\"\r\n                  [disabled]=\"preflightSummary()!.blockers.length > 0 || isProcessing()\"\r\n                  class=\"flex-1 py-2.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-40\">\r\n            Ti\u1EBFp t\u1EE5c t\u1EA1o PDF\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  }\r\n\r\n  <!-- Reset Confirmation Modal -->\r\n  @if (showResetModal()) {\r\n    <div class=\"fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4\">\r\n      <div class=\"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200\">\r\n        <div class=\"flex items-center gap-3 text-red-600 dark:text-red-400 mb-4\">\r\n          <div class=\"w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-lg\">\r\n            <i class=\"fa-solid fa-triangle-exclamation\"></i>\r\n          </div>\r\n          <h3 class=\"text-base font-bold\">\u0110\u01B0a M\u1EBB v\u1EC1 Tr\u1EA1ng Th\u00E1i Ban \u0110\u1EA7u</h3>\r\n        </div>\r\n        \r\n        <p class=\"text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed\">\r\n          H\u00E0nh \u0111\u1ED9ng n\u00E0y s\u1EBD <strong class=\"text-red-600 dark:text-red-400\">x\u00F3a s\u1ED1 li\u1EC7u hi\u1EC7n t\u1EA1i v\u00E0 kh\u1EDFi t\u1EA1o l\u1EA1i \u0111\u1EA7y \u0111\u1EE7 gi\u00E1 tr\u1ECB m\u1EB7c \u0111\u1ECBnh c\u1EE7a SOP</strong>, gi\u1ED1ng h\u1EC7t l\u1EA7n \u0111\u1EA7u m\u1EDF m\u1EBB. C\u00E1c b\u00E1o c\u00E1o PDF \u0111\u00E3 in \u0111\u01B0\u1EE3c chuy\u1EC3n v\u00E0o th\u01B0 m\u1EE5c Archived. B\u1EA1n kh\u00F4ng th\u1EC3 ho\u00E0n t\u00E1c h\u00E0nh \u0111\u1ED9ng n\u00E0y.\r\n        </p>\r\n        \r\n        <div class=\"mb-5\">\r\n          <label class=\"block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2\">\r\n            \u0110\u1EC3 x\u00E1c nh\u1EADn, vui l\u00F2ng nh\u1EADp ch\u1EEF <span class=\"text-red-600 dark:text-red-400 font-bold\">X\u00D3A</span> v\u00E0o \u00F4 d\u01B0\u1EDBi \u0111\u00E2y:\r\n          </label>\r\n          <input type=\"text\" \r\n                 [value]=\"resetConfirmText()\"\r\n                 (input)=\"onResetConfirmInput($event)\"\r\n                 placeholder=\"Nh\u1EADp X\u00D3A \u0111\u1EC3 x\u00E1c nh\u1EADn\"\r\n                 class=\"w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-red-500 text-center font-bold uppercase tracking-wider\" />\r\n        </div>\r\n        \r\n        <div class=\"flex gap-3\">\r\n          <button (click)=\"closeResetModal()\" \r\n                  class=\"flex-1 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 rounded-xl transition\">\r\n            H\u1EE7y B\u1ECF\r\n          </button>\r\n          <button (click)=\"triggerResetResults()\" \r\n                  [disabled]=\"resetConfirmText() !== 'X\u00D3A' || isProcessing()\"\r\n                  class=\"flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-40\">\r\n            X\u00F3a v\u00E0 Kh\u1EDFi T\u1EA1o L\u1EA1i\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  }\r\n</div>\r\n" }]
    }], () => [], { onUserActivity: [{
            type: HostListener,
            args: ['document:keyup']
        }, {
            type: HostListener,
            args: ['document:click']
        }], unloadNotification: [{
            type: HostListener,
            args: ['window:beforeunload', ['$event']]
        }], onUnload: [{
            type: HostListener,
            args: ['window:unload']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ResultEntryComponent, { className: "ResultEntryComponent", filePath: "src/app/features/results/result-entry.component.ts", lineNumber: 70 }); })();
/**
 * Trích xuất Google Drive File ID và chuyển đổi sang dạng URL preview an toàn cho iframe nhúng
 */
function getGoogleDrivePreviewUrl(url) {
    if (!url)
        return '';
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
        return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
    }
    const docDMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (docDMatch && docDMatch[1]) {
        return `https://docs.google.com/document/d/${docDMatch[1]}/preview`;
    }
    try {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('id');
        if (id) {
            return `https://drive.google.com/file/d/${id}/preview`;
        }
    }
    catch (e) {
        const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
        }
    }
    return url;
}
//# sourceMappingURL=result-entry.component.js.map