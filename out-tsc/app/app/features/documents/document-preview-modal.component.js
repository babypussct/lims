import { Component, EventEmitter, HostListener, Input, Output, ViewChild, computed, inject, signal, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { GoogleDriveService } from '../../core/services/google-drive.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import { ExcelDocumentViewerComponent } from './excel-document-viewer.component';
import { PdfDocumentViewerComponent } from './pdf-document-viewer.component';
import * as i0 from "@angular/core";
const _c0 = ["dialog"];
const _c1 = ["closeButton"];
function DocumentPreviewModalComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 35);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_24_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.printDocument()); });
    i0.ɵɵelement(1, "i", 36);
    i0.ɵɵelementStart(2, "span", 18);
    i0.ɵɵtext(3, "In");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r2.loading() || !!ctx_r2.error());
} }
function DocumentPreviewModalComponent_Conditional_41_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 38);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_41_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.printDocument()); });
    i0.ɵɵelement(1, "i", 36);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "In PDF");
    i0.ɵɵelementEnd()();
} }
function DocumentPreviewModalComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 28);
    i0.ɵɵtemplate(1, DocumentPreviewModalComponent_Conditional_41_Conditional_1_Template, 4, 0, "button", 37);
    i0.ɵɵelementStart(2, "button", 38);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_41_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openOriginal()); });
    i0.ɵɵelement(3, "i", 20);
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5, "M\u1EDF Google Drive");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 38);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_41_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleFullscreen()); });
    i0.ɵɵelement(7, "i", 6);
    i0.ɵɵelementStart(8, "span");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.kind() === "pdf" ? 1 : -1);
    i0.ɵɵadvance(6);
    i0.ɵɵclassProp("fa-expand", !ctx_r2.fullscreen())("fa-compress", ctx_r2.fullscreen());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.fullscreen() ? "Tho\u00E1t to\u00E0n m\u00E0n h\u00ECnh" : "To\u00E0n m\u00E0n h\u00ECnh");
} }
function DocumentPreviewModalComponent_Conditional_46_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 32)(1, "div", 39);
    i0.ɵɵelement(2, "i", 40);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3", 41);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 42);
    i0.ɵɵtext(6, "T\u1EC7p l\u1EDBn c\u00F3 th\u1EC3 c\u1EA7n th\u00EAm v\u00E0i gi\u00E2y");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 43);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_46_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.requestClose()); });
    i0.ɵɵtext(8, " H\u1EE7y ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.loadingLabel(), " ");
} }
function DocumentPreviewModalComponent_Conditional_47_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 33)(1, "div", 44)(2, "div", 45);
    i0.ɵɵelement(3, "i", 46);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h3", 47);
    i0.ɵɵtext(5, "Kh\u00F4ng th\u1EC3 xem tr\u01B0\u1EDBc t\u00E0i li\u1EC7u");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 48);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 49)(9, "button", 50);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_47_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.retry()); });
    i0.ɵɵelement(10, "i", 51);
    i0.ɵɵtext(11, "Th\u1EED l\u1EA1i ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "button", 52);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_47_Template_button_click_12_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.downloadOriginal()); });
    i0.ɵɵelement(13, "i", 53);
    i0.ɵɵtext(14, "T\u1EA3i b\u1EA3n g\u1ED1c ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "button", 54);
    i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Conditional_47_Template_button_click_15_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openOriginal()); });
    i0.ɵɵtext(16, " M\u1EDF Drive ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.error());
} }
function DocumentPreviewModalComponent_Conditional_48_Case_0_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-pdf-document-viewer", 61);
    i0.ɵɵlistener("ready", function DocumentPreviewModalComponent_Conditional_48_Case_0_Template_app_pdf_document_viewer_ready_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerReady()); })("failed", function DocumentPreviewModalComponent_Conditional_48_Case_0_Template_app_pdf_document_viewer_failed_0_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerError($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("blob", ctx_r2.previewBlob());
} }
function DocumentPreviewModalComponent_Conditional_48_Case_1_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "app-excel-document-viewer", 62);
    i0.ɵɵlistener("ready", function DocumentPreviewModalComponent_Conditional_48_Case_1_Template_app_excel_document_viewer_ready_0_listener() { i0.ɵɵrestoreView(_r9); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerReady()); })("failed", function DocumentPreviewModalComponent_Conditional_48_Case_1_Template_app_excel_document_viewer_failed_0_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerError($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("blob", ctx_r2.previewBlob())("fileName", ctx_r2.item.name);
} }
function DocumentPreviewModalComponent_Conditional_48_Case_2_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 57)(1, "img", 63);
    i0.ɵɵlistener("load", function DocumentPreviewModalComponent_Conditional_48_Case_2_Template_img_load_1_listener() { i0.ɵɵrestoreView(_r10); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerReady()); })("error", function DocumentPreviewModalComponent_Conditional_48_Case_2_Template_img_error_1_listener() { i0.ɵɵrestoreView(_r10); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerError("Kh\u00F4ng th\u1EC3 hi\u1EC3n th\u1ECB \u1EA3nh.")); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r2.objectUrl(), i0.ɵɵsanitizeUrl)("alt", ctx_r2.item.name);
} }
function DocumentPreviewModalComponent_Conditional_48_Case_3_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 58)(1, "video", 64);
    i0.ɵɵlistener("loadedmetadata", function DocumentPreviewModalComponent_Conditional_48_Case_3_Template_video_loadedmetadata_1_listener() { i0.ɵɵrestoreView(_r11); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerReady()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r2.objectUrl(), i0.ɵɵsanitizeUrl);
} }
function DocumentPreviewModalComponent_Conditional_48_Case_4_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 59)(1, "div", 65);
    i0.ɵɵelement(2, "i", 66);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "audio", 67);
    i0.ɵɵlistener("loadedmetadata", function DocumentPreviewModalComponent_Conditional_48_Case_4_Template_audio_loadedmetadata_3_listener() { i0.ɵɵrestoreView(_r12); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.onViewerReady()); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("src", ctx_r2.objectUrl());
} }
function DocumentPreviewModalComponent_Conditional_48_Case_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 60)(1, "pre", 68);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.previewText());
} }
function DocumentPreviewModalComponent_Conditional_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, DocumentPreviewModalComponent_Conditional_48_Case_0_Template, 1, 1, "app-pdf-document-viewer", 55)(1, DocumentPreviewModalComponent_Conditional_48_Case_1_Template, 1, 2, "app-excel-document-viewer", 56)(2, DocumentPreviewModalComponent_Conditional_48_Case_2_Template, 2, 2, "div", 57)(3, DocumentPreviewModalComponent_Conditional_48_Case_3_Template, 2, 1, "div", 58)(4, DocumentPreviewModalComponent_Conditional_48_Case_4_Template, 4, 1, "div", 59)(5, DocumentPreviewModalComponent_Conditional_48_Case_5_Template, 3, 1, "div", 60);
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional((tmp_3_0 = ctx_r2.kind()) === "pdf" ? 0 : tmp_3_0 === "excel" ? 1 : tmp_3_0 === "image" ? 2 : tmp_3_0 === "video" ? 3 : tmp_3_0 === "audio" ? 4 : tmp_3_0 === "text" ? 5 : -1);
} }
function DocumentPreviewModalComponent_Conditional_49_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "iframe", 69);
    i0.ɵɵlistener("load", function DocumentPreviewModalComponent_Conditional_49_Template_iframe_load_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onViewerReady()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("src", ctx_r2.safeUrl(), i0.ɵɵsanitizeResourceUrl)("title", "Xem tr\u01B0\u1EDBc " + ctx_r2.item.name);
} }
export class DocumentPreviewModalComponent {
    constructor() {
        this.closed = new EventEmitter();
        this.driveService = inject(GoogleDriveService);
        this.sanitizer = inject(DomSanitizer);
        this.kind = signal('drive');
        this.previewBlob = signal(null);
        this.objectUrl = signal('');
        this.safeUrl = signal(null);
        this.previewText = signal('');
        this.loading = signal(true);
        this.error = signal(null);
        this.mobileMenuOpen = signal(false);
        this.fullscreen = signal(false);
        this.loadingLabel = computed(() => {
            if (this.kind() === 'pdf')
                return 'Đang chuẩn bị PDF...';
            if (this.kind() === 'excel')
                return 'Đang đọc workbook...';
            return 'Đang tải bản xem trước...';
        });
        this.typeLabel = computed(() => {
            const labels = {
                pdf: 'PDF',
                excel: this.item?.name.toLowerCase().endsWith('.csv') ? 'CSV' : 'Excel',
                image: 'Hình ảnh',
                video: 'Video',
                audio: 'Âm thanh',
                text: 'Văn bản',
                drive: 'Google Drive',
            };
            return labels[this.kind()];
        });
        this.fileIcon = computed(() => {
            const icons = {
                pdf: 'fa-file-pdf',
                excel: 'fa-file-excel',
                image: 'fa-file-image',
                video: 'fa-file-video',
                audio: 'fa-file-audio',
                text: 'fa-file-lines',
                drive: 'fa-file',
            };
            return icons[this.kind()];
        });
        this.previousBodyOverflow = '';
    }
    ngOnInit() {
        this.kind.set(this.detectKind(this.item));
        this.previousFocus = document.activeElement;
        this.previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        void this.loadPreview();
    }
    ngAfterViewInit() {
        setTimeout(() => this.dialog?.nativeElement.focus());
    }
    ngOnDestroy() {
        this.abortController?.abort();
        this.releaseObjectUrl();
        document.body.style.overflow = this.previousBodyOverflow;
        if (document.fullscreenElement === this.dialog?.nativeElement) {
            void document.exitFullscreen().catch(() => undefined);
        }
        setTimeout(() => this.previousFocus?.focus());
    }
    onFullscreenChange() {
        this.fullscreen.set(document.fullscreenElement === this.dialog?.nativeElement);
    }
    onKeydown(event) {
        if (event.key === 'Escape') {
            if (this.kind() === 'excel' && this.excelViewer?.handleEscape()) {
                event.preventDefault();
                return;
            }
            if (this.mobileMenuOpen()) {
                this.mobileMenuOpen.set(false);
            }
            else if (document.fullscreenElement) {
                void document.exitFullscreen();
            }
            else {
                this.requestClose();
            }
            return;
        }
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p' && this.kind() === 'pdf') {
            event.preventDefault();
            this.printDocument();
            return;
        }
        if (event.key !== 'Tab')
            return;
        const container = this.dialog?.nativeElement;
        if (!container)
            return;
        const focusable = Array.from(container.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), video[controls], audio[controls], [tabindex]:not([tabindex="-1"])')).filter(element => !element.hasAttribute('hidden') && element.offsetParent !== null);
        if (!focusable.length)
            return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
    requestClose() {
        this.closed.emit();
    }
    closeMenus() {
        this.mobileMenuOpen.set(false);
    }
    toggleMobileMenu(event) {
        event.stopPropagation();
        this.mobileMenuOpen.update(value => !value);
    }
    retry() {
        void this.loadPreview();
    }
    onViewerReady() {
        this.loading.set(false);
    }
    onViewerError(message) {
        this.loading.set(false);
        this.error.set(message || 'Không thể hiển thị tài liệu.');
    }
    openOriginal() {
        const link = this.item.webViewLink || `https://drive.google.com/file/d/${this.item.id}/view`;
        openInNewTab(link);
        this.mobileMenuOpen.set(false);
    }
    downloadOriginal() {
        const blob = this.previewBlob();
        if (blob) {
            const url = this.objectUrl() || URL.createObjectURL(blob);
            const temporary = !this.objectUrl();
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = this.exportFileName();
            anchor.click();
            if (temporary)
                setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        else if (this.item.webContentLink) {
            openInNewTab(this.item.webContentLink);
        }
        else {
            this.openOriginal();
        }
        this.mobileMenuOpen.set(false);
    }
    printDocument() {
        const url = this.objectUrl();
        if (url)
            openInNewTab(url);
        else
            this.openOriginal();
        this.mobileMenuOpen.set(false);
    }
    async toggleFullscreen() {
        const container = this.dialog?.nativeElement;
        if (!container)
            return;
        try {
            if (document.fullscreenElement)
                await document.exitFullscreen();
            else
                await container.requestFullscreen();
        }
        catch {
            // Fullscreen may be blocked by managed mobile browsers.
        }
        this.mobileMenuOpen.set(false);
    }
    formatSize(bytes) {
        if (!bytes)
            return 'Không rõ dung lượng';
        const value = Number(bytes);
        if (!Number.isFinite(value))
            return 'Không rõ dung lượng';
        if (value < 1024)
            return `${value} B`;
        if (value < 1024 * 1024)
            return `${(value / 1024).toFixed(1)} KB`;
        return `${(value / (1024 * 1024)).toFixed(1)} MB`;
    }
    formatDate(value) {
        if (!value)
            return 'Không rõ ngày cập nhật';
        return new Date(value).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    async loadPreview() {
        this.abortController?.abort();
        this.releaseObjectUrl();
        const controller = new AbortController();
        this.abortController = controller;
        this.previewBlob.set(null);
        this.safeUrl.set(null);
        this.previewText.set('');
        this.loading.set(true);
        this.error.set(null);
        try {
            const kind = this.kind();
            if (kind === 'drive') {
                const previewLink = this.item.mimeType.startsWith('application/vnd.google-apps.')
                    ? (this.item.webViewLink || `https://drive.google.com/open?id=${this.item.id}`).replace(/\/edit.*$/, '/preview')
                    : `https://drive.google.com/file/d/${this.item.id}/preview`;
                this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(previewLink));
                return;
            }
            const blob = this.item.mimeType === 'application/vnd.google-apps.spreadsheet'
                ? await this.driveService.exportPublicFile(this.item.id, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', controller.signal)
                : await this.driveService.downloadPublicFile(this.item.id, controller.signal);
            if (controller.signal.aborted)
                return;
            this.previewBlob.set(blob);
            const url = URL.createObjectURL(blob);
            this.objectUrl.set(url);
            if (kind === 'text') {
                this.previewText.set(await blob.text());
                this.loading.set(false);
            }
        }
        catch (error) {
            if (error?.name === 'AbortError')
                return;
            this.loading.set(false);
            this.error.set(error instanceof Error ? error.message : 'Không thể tải bản xem trước tài liệu.');
        }
    }
    detectKind(item) {
        const name = item.name.toLowerCase();
        const mime = item.mimeType.toLowerCase();
        if (name.endsWith('.pdf') || mime === 'application/pdf')
            return 'pdf';
        if (/\.(xlsx|xls|xlsm|csv)$/.test(name) ||
            mime === 'application/vnd.google-apps.spreadsheet' ||
            mime.includes('spreadsheet') ||
            mime.includes('excel') ||
            mime === 'text/csv')
            return 'excel';
        if (mime.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name))
            return 'image';
        if (mime.startsWith('video/'))
            return 'video';
        if (mime.startsWith('audio/'))
            return 'audio';
        if (mime.startsWith('text/') || /\.(txt|log|md|json|xml|csv)$/.test(name))
            return 'text';
        return 'drive';
    }
    exportFileName() {
        if (this.item.mimeType === 'application/vnd.google-apps.spreadsheet' && !/\.xlsx$/i.test(this.item.name)) {
            return `${this.item.name}.xlsx`;
        }
        return this.item.name || 'tai-lieu';
    }
    releaseObjectUrl() {
        const url = this.objectUrl();
        if (url)
            URL.revokeObjectURL(url);
        this.objectUrl.set('');
    }
    static { this.ɵfac = function DocumentPreviewModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DocumentPreviewModalComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DocumentPreviewModalComponent, selectors: [["app-document-preview-modal"]], viewQuery: function DocumentPreviewModalComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
            i0.ɵɵviewQuery(_c1, 5);
            i0.ɵɵviewQuery(ExcelDocumentViewerComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.dialog = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.closeButton = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.excelViewer = _t.first);
        } }, hostBindings: function DocumentPreviewModalComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("fullscreenchange", function DocumentPreviewModalComponent_fullscreenchange_HostBindingHandler() { return ctx.onFullscreenChange(); }, false, i0.ɵɵresolveDocument)("keydown", function DocumentPreviewModalComponent_keydown_HostBindingHandler($event) { return ctx.onKeydown($event); }, false, i0.ɵɵresolveDocument);
        } }, inputs: { item: "item" }, outputs: { closed: "closed" }, decls: 50, vars: 36, consts: [["dialog", ""], ["closeButton", ""], [1, "document-preview-overlay", "fixed", "inset-0", "z-[100]", "bg-slate-950/80", "backdrop-blur-sm", "p-0", "md:p-2", "lg:p-3", "animate-fade-in", 3, "mousedown"], ["role", "dialog", "aria-modal", "true", "aria-labelledby", "document-preview-title", "tabindex", "-1", 1, "document-preview-dialog", "w-full", "h-full", "min-h-0", "bg-white", "dark:bg-slate-900", "md:rounded-2xl", "shadow-2xl", "ring-1", "ring-white/10", "overflow-hidden", "flex", "flex-col", 3, "mousedown"], [1, "document-preview-header", "min-h-14", "md:h-14", "shrink-0", "flex", "items-center", "gap-2", "px-2.5", "md:px-3", "border-b", "border-slate-200", "dark:border-slate-700", "bg-white", "dark:bg-slate-900"], [1, "document-preview-file-icon", "w-9", "h-9", "rounded-lg", "flex", "items-center", "justify-center", "shrink-0"], [1, "fa-solid"], [1, "min-w-0", "flex-1"], ["id", "document-preview-title", 1, "text-sm", "md:text-[15px]", "font-black", "text-slate-800", "dark:text-white", "truncate", "leading-tight", 3, "title"], [1, "document-preview-meta", "mt-0.5", "flex", "items-center", "gap-1.5", "text-[10px]", "md:text-[11px]", "font-semibold", "text-slate-400", "whitespace-nowrap", "overflow-hidden"], [1, "uppercase"], [1, "hidden", "sm:inline"], [1, "inline-flex", "items-center", "px-1.5", "py-0.5", "rounded", "bg-slate-100", "dark:bg-slate-800", "text-slate-500", "dark:text-slate-300"], [1, "fa-solid", "fa-lock", "mr-1", "text-[8px]"], [1, "hidden", "sm:flex", "items-center", "gap-1.5", "shrink-0"], ["type", "button", "title", "In PDF", 1, "preview-action-button", 3, "disabled"], ["type", "button", "title", "T\u1EA3i b\u1EA3n g\u1ED1c", 1, "preview-action-button", "preview-action-primary", 3, "click", "disabled"], [1, "fa-solid", "fa-download"], [1, "hidden", "lg:inline"], ["type", "button", "title", "M\u1EDF trong Google Drive", 1, "preview-action-button", 3, "click"], [1, "fa-solid", "fa-arrow-up-right-from-square"], [1, "hidden", "xl:inline"], ["type", "button", "title", "To\u00E0n m\u00E0n h\u00ECnh", "aria-label", "To\u00E0n m\u00E0n h\u00ECnh", 1, "preview-icon-button", 3, "click"], [1, "sm:hidden", "flex", "items-center", "gap-1", "shrink-0"], ["type", "button", "aria-label", "T\u1EA3i b\u1EA3n g\u1ED1c", 1, "preview-icon-button", "text-fuchsia-600", "dark:text-fuchsia-300", 3, "click", "disabled"], [1, "relative"], ["type", "button", "aria-label", "Th\u00EAm h\u00E0nh \u0111\u1ED9ng", 1, "preview-icon-button", 3, "click"], [1, "fa-solid", "fa-ellipsis-vertical"], [1, "absolute", "right-0", "top-11", "z-50", "w-48", "p-1.5", "rounded-xl", "bg-white", "dark:bg-slate-800", "border", "border-slate-200", "dark:border-slate-700", "shadow-xl"], ["type", "button", "title", "\u0110\u00F3ng (Esc)", "aria-label", "\u0110\u00F3ng xem tr\u01B0\u1EDBc", 1, "preview-icon-button", "hover:!bg-slate-100", "dark:hover:!bg-slate-800", 3, "click"], [1, "fa-solid", "fa-times", "text-lg"], [1, "flex-1", "min-h-0", "relative", "bg-slate-100", "dark:bg-slate-950"], [1, "absolute", "inset-0", "z-30", "flex", "flex-col", "items-center", "justify-center", "bg-white", "dark:bg-slate-900"], [1, "absolute", "inset-0", "z-40", "flex", "items-center", "justify-center", "p-4", "bg-slate-50", "dark:bg-slate-950"], [1, "w-full", "h-full", "border-0", "bg-white", 3, "src", "title"], ["type", "button", "title", "In PDF", 1, "preview-action-button", 3, "click", "disabled"], [1, "fa-solid", "fa-print"], ["type", "button", 1, "preview-menu-item"], ["type", "button", 1, "preview-menu-item", 3, "click"], [1, "w-11", "h-11", "rounded-xl", "bg-fuchsia-50", "dark:bg-fuchsia-950/50", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-circle-notch", "fa-spin", "text-2xl", "text-fuchsia-600"], [1, "mt-3", "text-sm", "font-black", "text-slate-700", "dark:text-slate-200"], [1, "mt-1", "text-xs", "text-slate-400"], ["type", "button", 1, "mt-4", "px-3", "py-1.5", "rounded-lg", "text-xs", "font-bold", "text-slate-500", "hover:bg-slate-100", "dark:hover:bg-slate-800", 3, "click"], [1, "w-full", "max-w-md", "p-5", "md:p-6", "rounded-2xl", "bg-white", "dark:bg-slate-900", "border", "border-slate-200", "dark:border-slate-700", "shadow-xl", "text-center"], [1, "mx-auto", "w-12", "h-12", "rounded-xl", "bg-red-50", "dark:bg-red-950/50", "text-red-500", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-triangle-exclamation", "text-xl"], [1, "mt-3", "text-base", "font-black", "text-slate-800", "dark:text-white"], [1, "mt-1.5", "text-xs", "leading-relaxed", "text-slate-500", "dark:text-slate-400"], [1, "mt-4", "flex", "flex-col", "sm:flex-row", "justify-center", "gap-2"], ["type", "button", 1, "px-4", "py-2", "rounded-lg", "bg-fuchsia-600", "hover:bg-fuchsia-500", "text-white", "text-xs", "font-bold", 3, "click"], [1, "fa-solid", "fa-rotate-right", "mr-1.5"], ["type", "button", 1, "px-4", "py-2", "rounded-lg", "bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200", "text-xs", "font-bold", 3, "click"], [1, "fa-solid", "fa-download", "mr-1.5"], ["type", "button", 1, "px-4", "py-2", "rounded-lg", "border", "border-slate-200", "dark:border-slate-700", "text-slate-600", "dark:text-slate-300", "text-xs", "font-bold", 3, "click"], [1, "block", "h-full", 3, "blob"], [1, "block", "h-full", 3, "blob", "fileName"], [1, "w-full", "h-full", "overflow-auto", "p-3", "md:p-6", "flex", "items-center", "justify-center"], [1, "w-full", "h-full", "p-3", "md:p-6", "flex", "items-center", "justify-center", "bg-black"], [1, "w-full", "h-full", "p-5", "flex", "flex-col", "items-center", "justify-center"], [1, "w-full", "h-full", "overflow-auto", "p-3", "md:p-6"], [1, "block", "h-full", 3, "ready", "failed", "blob"], [1, "block", "h-full", 3, "ready", "failed", "blob", "fileName"], [1, "max-w-full", "max-h-full", "object-contain", "rounded-lg", "shadow-xl", "bg-white", 3, "load", "error", "src", "alt"], ["controls", "", "playsinline", "", 1, "max-w-full", "max-h-full", "rounded-lg", "shadow-xl", 3, "loadedmetadata", "src"], [1, "w-24", "h-24", "rounded-3xl", "bg-fuchsia-100", "dark:bg-fuchsia-950", "text-fuchsia-600", "flex", "items-center", "justify-center", "shadow-inner"], [1, "fa-solid", "fa-wave-square", "text-4xl"], ["controls", "", 1, "mt-6", "w-full", "max-w-xl", 3, "loadedmetadata", "src"], [1, "min-h-full", "max-w-6xl", "mx-auto", "p-4", "md:p-6", "bg-white", "dark:bg-slate-900", "rounded-xl", "border", "border-slate-200", "dark:border-slate-700", "text-xs", "md:text-sm", "leading-relaxed", "text-slate-700", "dark:text-slate-200", "whitespace-pre-wrap", "break-words"], [1, "w-full", "h-full", "border-0", "bg-white", 3, "load", "src", "title"]], template: function DocumentPreviewModalComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 2);
            i0.ɵɵlistener("mousedown", function DocumentPreviewModalComponent_Template_div_mousedown_0_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.closeMenus()); });
            i0.ɵɵelementStart(1, "section", 3, 0);
            i0.ɵɵlistener("mousedown", function DocumentPreviewModalComponent_Template_section_mousedown_1_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView($event.stopPropagation()); });
            i0.ɵɵelementStart(3, "header", 4)(4, "div", 5);
            i0.ɵɵelement(5, "i", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 7)(7, "h2", 8);
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "div", 9)(10, "span", 10);
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "span");
            i0.ɵɵtext(13, "\u2022");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "span");
            i0.ɵɵtext(15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "span", 11);
            i0.ɵɵtext(17, "\u2022");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "span", 11);
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "span", 12);
            i0.ɵɵelement(21, "i", 13);
            i0.ɵɵtext(22, "Ch\u1EC9 \u0111\u1ECDc ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div", 14);
            i0.ɵɵtemplate(24, DocumentPreviewModalComponent_Conditional_24_Template, 4, 1, "button", 15);
            i0.ɵɵelementStart(25, "button", 16);
            i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Template_button_click_25_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.downloadOriginal()); });
            i0.ɵɵelement(26, "i", 17);
            i0.ɵɵelementStart(27, "span", 18);
            i0.ɵɵtext(28, "T\u1EA3i xu\u1ED1ng");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(29, "button", 19);
            i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Template_button_click_29_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.openOriginal()); });
            i0.ɵɵelement(30, "i", 20);
            i0.ɵɵelementStart(31, "span", 21);
            i0.ɵɵtext(32, "M\u1EDF Drive");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "button", 22);
            i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Template_button_click_33_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.toggleFullscreen()); });
            i0.ɵɵelement(34, "i", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(35, "div", 23)(36, "button", 24);
            i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Template_button_click_36_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.downloadOriginal()); });
            i0.ɵɵelement(37, "i", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "div", 25)(39, "button", 26);
            i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Template_button_click_39_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.toggleMobileMenu($event)); });
            i0.ɵɵelement(40, "i", 27);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(41, DocumentPreviewModalComponent_Conditional_41_Template, 10, 6, "div", 28);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(42, "button", 29, 1);
            i0.ɵɵlistener("click", function DocumentPreviewModalComponent_Template_button_click_42_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.requestClose()); });
            i0.ɵɵelement(44, "i", 30);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "main", 31);
            i0.ɵɵtemplate(46, DocumentPreviewModalComponent_Conditional_46_Template, 9, 1, "div", 32)(47, DocumentPreviewModalComponent_Conditional_47_Template, 17, 1, "div", 33)(48, DocumentPreviewModalComponent_Conditional_48_Template, 6, 1)(49, DocumentPreviewModalComponent_Conditional_49_Template, 1, 2, "iframe", 34);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("bg-red-50", ctx.kind() === "pdf")("dark:bg-red-950", ctx.kind() === "pdf")("text-red-600", ctx.kind() === "pdf")("bg-emerald-50", ctx.kind() === "excel")("dark:bg-emerald-950", ctx.kind() === "excel")("text-emerald-600", ctx.kind() === "excel")("bg-fuchsia-50", ctx.kind() !== "pdf" && ctx.kind() !== "excel")("dark:bg-fuchsia-950", ctx.kind() !== "pdf" && ctx.kind() !== "excel")("text-fuchsia-600", ctx.kind() !== "pdf" && ctx.kind() !== "excel");
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.fileIcon());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("title", ctx.item.name);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.item.name);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.typeLabel());
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.formatSize(ctx.item.size));
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.formatDate(ctx.item.modifiedTime));
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.kind() === "pdf" ? 24 : -1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.loading() && !ctx.previewBlob());
            i0.ɵɵadvance(9);
            i0.ɵɵclassProp("fa-expand", !ctx.fullscreen())("fa-compress", ctx.fullscreen());
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.loading() && !ctx.previewBlob());
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.mobileMenuOpen() ? 41 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.loading() ? 46 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.error() ? 47 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(!ctx.error() && ctx.previewBlob() ? 48 : !ctx.error() && ctx.kind() === "drive" && ctx.safeUrl() ? 49 : -1);
        } }, dependencies: [CommonModule, ExcelDocumentViewerComponent, PdfDocumentViewerComponent], styles: [".document-preview-overlay[_ngcontent-%COMP%] {\n      height: 100dvh;\n      min-height: 100dvh;\n      max-height: 100dvh;\n      overflow: hidden;\n      padding-top: max(0px, env(safe-area-inset-top));\n      padding-bottom: max(0px, env(safe-area-inset-bottom));\n    }\n    .document-preview-dialog[_ngcontent-%COMP%] {\n      height: 100%;\n      max-height: 100%;\n      min-height: 0;\n    }\n    .preview-action-button[_ngcontent-%COMP%] {\n      height: 2.25rem;\n      padding-inline: .7rem;\n      border-radius: .6rem;\n      border: 1px solid #e2e8f0;\n      color: #475569;\n      display: inline-flex;\n      align-items: center;\n      gap: .4rem;\n      font-size: .72rem;\n      font-weight: 800;\n      transition: color .15s, background-color .15s, border-color .15s;\n    }\n    .preview-action-button[_ngcontent-%COMP%]:hover:not(:disabled) { color: #c026d3; background: #fdf4ff; border-color: #f0abfc; }\n    .preview-action-button[_ngcontent-%COMP%]:disabled { opacity: .4; cursor: not-allowed; }\n    .preview-action-primary[_ngcontent-%COMP%] { color: white; background: #c026d3; border-color: #c026d3; }\n    .preview-action-primary[_ngcontent-%COMP%]:hover:not(:disabled) { color: white; background: #a21caf; border-color: #a21caf; }\n    .preview-icon-button[_ngcontent-%COMP%] {\n      width: 2.25rem;\n      height: 2.25rem;\n      border-radius: .6rem;\n      color: #64748b;\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      transition: color .15s, background-color .15s;\n    }\n    .preview-icon-button[_ngcontent-%COMP%]:hover { color: #c026d3; background: #fdf4ff; }\n    .preview-menu-item[_ngcontent-%COMP%] {\n      width: 100%;\n      min-height: 2.5rem;\n      padding-inline: .65rem;\n      border-radius: .55rem;\n      color: #475569;\n      display: flex;\n      align-items: center;\n      gap: .65rem;\n      font-size: .75rem;\n      font-weight: 700;\n      text-align: left;\n    }\n    .preview-menu-item[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] { width: 1rem; color: #a21caf; }\n    .preview-menu-item[_ngcontent-%COMP%]:hover { background: #f8fafc; }\n    .dark[_nghost-%COMP%]   .preview-action-button[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-action-button[_ngcontent-%COMP%] { color: #cbd5e1; border-color: #334155; }\n    .dark[_nghost-%COMP%]   .preview-action-button[_ngcontent-%COMP%]:hover:not(:disabled), .dark   [_nghost-%COMP%]   .preview-action-button[_ngcontent-%COMP%]:hover:not(:disabled) { color: #f0abfc; background: rgba(112,26,117,.3); border-color: #86198f; }\n    .dark[_nghost-%COMP%]   .preview-action-primary[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-action-primary[_ngcontent-%COMP%] { color: white; background: #a21caf; border-color: #a21caf; }\n    .dark[_nghost-%COMP%]   .preview-icon-button[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-icon-button[_ngcontent-%COMP%] { color: #cbd5e1; }\n    .dark[_nghost-%COMP%]   .preview-icon-button[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .preview-icon-button[_ngcontent-%COMP%]:hover { color: #f0abfc; background: rgba(112,26,117,.3); }\n    .dark[_nghost-%COMP%]   .preview-menu-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .preview-menu-item[_ngcontent-%COMP%] { color: #e2e8f0; }\n    .dark[_nghost-%COMP%]   .preview-menu-item[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .preview-menu-item[_ngcontent-%COMP%]:hover { background: #334155; }\n    @media (max-width: 640px), (max-height: 640px) {\n      .document-preview-header[_ngcontent-%COMP%] {\n        min-height: 3rem;\n        height: 3rem;\n      }\n      .document-preview-file-icon[_ngcontent-%COMP%] {\n        width: 2rem;\n        height: 2rem;\n      }\n      .document-preview-meta[_ngcontent-%COMP%] {\n        display: none;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DocumentPreviewModalComponent, [{
        type: Component,
        args: [{ selector: 'app-document-preview-modal', standalone: true, imports: [CommonModule, ExcelDocumentViewerComponent, PdfDocumentViewerComponent], template: `
    <div class="document-preview-overlay fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm p-0 md:p-2 lg:p-3 animate-fade-in"
         (mousedown)="closeMenus()">
      <section #dialog
               class="document-preview-dialog w-full h-full min-h-0 bg-white dark:bg-slate-900 md:rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden flex flex-col"
               role="dialog"
               aria-modal="true"
               aria-labelledby="document-preview-title"
               tabindex="-1"
               (mousedown)="$event.stopPropagation()">
        <header class="document-preview-header min-h-14 md:h-14 shrink-0 flex items-center gap-2 px-2.5 md:px-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div class="document-preview-file-icon w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
               [class.bg-red-50]="kind() === 'pdf'" [class.dark:bg-red-950]="kind() === 'pdf'"
               [class.text-red-600]="kind() === 'pdf'"
               [class.bg-emerald-50]="kind() === 'excel'" [class.dark:bg-emerald-950]="kind() === 'excel'"
               [class.text-emerald-600]="kind() === 'excel'"
               [class.bg-fuchsia-50]="kind() !== 'pdf' && kind() !== 'excel'"
               [class.dark:bg-fuchsia-950]="kind() !== 'pdf' && kind() !== 'excel'"
               [class.text-fuchsia-600]="kind() !== 'pdf' && kind() !== 'excel'">
            <i class="fa-solid" [class]="fileIcon()"></i>
          </div>

          <div class="min-w-0 flex-1">
            <h2 id="document-preview-title"
                class="text-sm md:text-[15px] font-black text-slate-800 dark:text-white truncate leading-tight"
                [title]="item.name">{{ item.name }}</h2>
            <div class="document-preview-meta mt-0.5 flex items-center gap-1.5 text-[10px] md:text-[11px] font-semibold text-slate-400 whitespace-nowrap overflow-hidden">
              <span class="uppercase">{{ typeLabel() }}</span>
              <span>•</span>
              <span>{{ formatSize(item.size) }}</span>
              <span class="hidden sm:inline">•</span>
              <span class="hidden sm:inline">{{ formatDate(item.modifiedTime) }}</span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                <i class="fa-solid fa-lock mr-1 text-[8px]"></i>Chỉ đọc
              </span>
            </div>
          </div>

          <div class="hidden sm:flex items-center gap-1.5 shrink-0">
            @if (kind() === 'pdf') {
              <button type="button" (click)="printDocument()" [disabled]="loading() || !!error()"
                      class="preview-action-button" title="In PDF">
                <i class="fa-solid fa-print"></i><span class="hidden lg:inline">In</span>
              </button>
            }
            <button type="button" (click)="downloadOriginal()" [disabled]="loading() && !previewBlob()"
                    class="preview-action-button preview-action-primary" title="Tải bản gốc">
              <i class="fa-solid fa-download"></i><span class="hidden lg:inline">Tải xuống</span>
            </button>
            <button type="button" (click)="openOriginal()" class="preview-action-button" title="Mở trong Google Drive">
              <i class="fa-solid fa-arrow-up-right-from-square"></i><span class="hidden xl:inline">Mở Drive</span>
            </button>
            <button type="button" (click)="toggleFullscreen()" class="preview-icon-button" title="Toàn màn hình" aria-label="Toàn màn hình">
              <i class="fa-solid" [class.fa-expand]="!fullscreen()" [class.fa-compress]="fullscreen()"></i>
            </button>
          </div>

          <div class="sm:hidden flex items-center gap-1 shrink-0">
            <button type="button" (click)="downloadOriginal()" [disabled]="loading() && !previewBlob()"
                    class="preview-icon-button text-fuchsia-600 dark:text-fuchsia-300" aria-label="Tải bản gốc">
              <i class="fa-solid fa-download"></i>
            </button>
            <div class="relative">
              <button type="button" (click)="toggleMobileMenu($event)" class="preview-icon-button" aria-label="Thêm hành động">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
              @if (mobileMenuOpen()) {
                <div class="absolute right-0 top-11 z-50 w-48 p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl">
                  @if (kind() === 'pdf') {
                    <button type="button" (click)="printDocument()" class="preview-menu-item">
                      <i class="fa-solid fa-print"></i><span>In PDF</span>
                    </button>
                  }
                  <button type="button" (click)="openOriginal()" class="preview-menu-item">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i><span>Mở Google Drive</span>
                  </button>
                  <button type="button" (click)="toggleFullscreen()" class="preview-menu-item">
                    <i class="fa-solid" [class.fa-expand]="!fullscreen()" [class.fa-compress]="fullscreen()"></i>
                    <span>{{ fullscreen() ? 'Thoát toàn màn hình' : 'Toàn màn hình' }}</span>
                  </button>
                </div>
              }
            </div>
          </div>

          <button #closeButton type="button" (click)="requestClose()"
                  class="preview-icon-button hover:!bg-slate-100 dark:hover:!bg-slate-800"
                  title="Đóng (Esc)" aria-label="Đóng xem trước">
            <i class="fa-solid fa-times text-lg"></i>
          </button>
        </header>

        <main class="flex-1 min-h-0 relative bg-slate-100 dark:bg-slate-950">
          @if (loading()) {
            <div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
              <div class="w-11 h-11 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/50 flex items-center justify-center">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl text-fuchsia-600"></i>
              </div>
              <h3 class="mt-3 text-sm font-black text-slate-700 dark:text-slate-200">
                {{ loadingLabel() }}
              </h3>
              <p class="mt-1 text-xs text-slate-400">Tệp lớn có thể cần thêm vài giây</p>
              <button type="button" (click)="requestClose()" class="mt-4 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                Hủy
              </button>
            </div>
          }

          @if (error()) {
            <div class="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
              <div class="w-full max-w-md p-5 md:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl text-center">
                <div class="mx-auto w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-500 flex items-center justify-center">
                  <i class="fa-solid fa-triangle-exclamation text-xl"></i>
                </div>
                <h3 class="mt-3 text-base font-black text-slate-800 dark:text-white">Không thể xem trước tài liệu</h3>
                <p class="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{{ error() }}</p>
                <div class="mt-4 flex flex-col sm:flex-row justify-center gap-2">
                  <button type="button" (click)="retry()" class="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold">
                    <i class="fa-solid fa-rotate-right mr-1.5"></i>Thử lại
                  </button>
                  <button type="button" (click)="downloadOriginal()" class="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold">
                    <i class="fa-solid fa-download mr-1.5"></i>Tải bản gốc
                  </button>
                  <button type="button" (click)="openOriginal()" class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                    Mở Drive
                  </button>
                </div>
              </div>
            </div>
          }

          @if (!error() && previewBlob()) {
            @switch (kind()) {
              @case ('pdf') {
                <app-pdf-document-viewer class="block h-full"
                  [blob]="previewBlob()!"
                  (ready)="onViewerReady()"
                  (failed)="onViewerError($event)">
                </app-pdf-document-viewer>
              }
              @case ('excel') {
                <app-excel-document-viewer class="block h-full"
                  [blob]="previewBlob()!"
                  [fileName]="item.name"
                  (ready)="onViewerReady()"
                  (failed)="onViewerError($event)">
                </app-excel-document-viewer>
              }
              @case ('image') {
                <div class="w-full h-full overflow-auto p-3 md:p-6 flex items-center justify-center">
                  <img [src]="objectUrl()" [alt]="item.name" (load)="onViewerReady()" (error)="onViewerError('Không thể hiển thị ảnh.')"
                       class="max-w-full max-h-full object-contain rounded-lg shadow-xl bg-white">
                </div>
              }
              @case ('video') {
                <div class="w-full h-full p-3 md:p-6 flex items-center justify-center bg-black">
                  <video [src]="objectUrl()" controls playsinline (loadedmetadata)="onViewerReady()"
                         class="max-w-full max-h-full rounded-lg shadow-xl"></video>
                </div>
              }
              @case ('audio') {
                <div class="w-full h-full p-5 flex flex-col items-center justify-center">
                  <div class="w-24 h-24 rounded-3xl bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-600 flex items-center justify-center shadow-inner">
                    <i class="fa-solid fa-wave-square text-4xl"></i>
                  </div>
                  <audio [src]="objectUrl()" controls (loadedmetadata)="onViewerReady()" class="mt-6 w-full max-w-xl"></audio>
                </div>
              }
              @case ('text') {
                <div class="w-full h-full overflow-auto p-3 md:p-6">
                  <pre class="min-h-full max-w-6xl mx-auto p-4 md:p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">{{ previewText() }}</pre>
                </div>
              }
            }
          } @else if (!error() && kind() === 'drive' && safeUrl()) {
            <iframe [src]="safeUrl()" (load)="onViewerReady()" [title]="'Xem trước ' + item.name"
                    class="w-full h-full border-0 bg-white"></iframe>
          }
        </main>
      </section>
    </div>
  `, styles: ["\n    .document-preview-overlay {\n      height: 100dvh;\n      min-height: 100dvh;\n      max-height: 100dvh;\n      overflow: hidden;\n      padding-top: max(0px, env(safe-area-inset-top));\n      padding-bottom: max(0px, env(safe-area-inset-bottom));\n    }\n    .document-preview-dialog {\n      height: 100%;\n      max-height: 100%;\n      min-height: 0;\n    }\n    .preview-action-button {\n      height: 2.25rem;\n      padding-inline: .7rem;\n      border-radius: .6rem;\n      border: 1px solid #e2e8f0;\n      color: #475569;\n      display: inline-flex;\n      align-items: center;\n      gap: .4rem;\n      font-size: .72rem;\n      font-weight: 800;\n      transition: color .15s, background-color .15s, border-color .15s;\n    }\n    .preview-action-button:hover:not(:disabled) { color: #c026d3; background: #fdf4ff; border-color: #f0abfc; }\n    .preview-action-button:disabled { opacity: .4; cursor: not-allowed; }\n    .preview-action-primary { color: white; background: #c026d3; border-color: #c026d3; }\n    .preview-action-primary:hover:not(:disabled) { color: white; background: #a21caf; border-color: #a21caf; }\n    .preview-icon-button {\n      width: 2.25rem;\n      height: 2.25rem;\n      border-radius: .6rem;\n      color: #64748b;\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      transition: color .15s, background-color .15s;\n    }\n    .preview-icon-button:hover { color: #c026d3; background: #fdf4ff; }\n    .preview-menu-item {\n      width: 100%;\n      min-height: 2.5rem;\n      padding-inline: .65rem;\n      border-radius: .55rem;\n      color: #475569;\n      display: flex;\n      align-items: center;\n      gap: .65rem;\n      font-size: .75rem;\n      font-weight: 700;\n      text-align: left;\n    }\n    .preview-menu-item i { width: 1rem; color: #a21caf; }\n    .preview-menu-item:hover { background: #f8fafc; }\n    :host-context(.dark) .preview-action-button { color: #cbd5e1; border-color: #334155; }\n    :host-context(.dark) .preview-action-button:hover:not(:disabled) { color: #f0abfc; background: rgba(112,26,117,.3); border-color: #86198f; }\n    :host-context(.dark) .preview-action-primary { color: white; background: #a21caf; border-color: #a21caf; }\n    :host-context(.dark) .preview-icon-button { color: #cbd5e1; }\n    :host-context(.dark) .preview-icon-button:hover { color: #f0abfc; background: rgba(112,26,117,.3); }\n    :host-context(.dark) .preview-menu-item { color: #e2e8f0; }\n    :host-context(.dark) .preview-menu-item:hover { background: #334155; }\n    @media (max-width: 640px), (max-height: 640px) {\n      .document-preview-header {\n        min-height: 3rem;\n        height: 3rem;\n      }\n      .document-preview-file-icon {\n        width: 2rem;\n        height: 2rem;\n      }\n      .document-preview-meta {\n        display: none;\n      }\n    }\n  "] }]
    }], null, { item: [{
            type: Input,
            args: [{ required: true }]
        }], closed: [{
            type: Output
        }], dialog: [{
            type: ViewChild,
            args: ['dialog']
        }], closeButton: [{
            type: ViewChild,
            args: ['closeButton']
        }], excelViewer: [{
            type: ViewChild,
            args: [ExcelDocumentViewerComponent]
        }], onFullscreenChange: [{
            type: HostListener,
            args: ['document:fullscreenchange']
        }], onKeydown: [{
            type: HostListener,
            args: ['document:keydown', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DocumentPreviewModalComponent, { className: "DocumentPreviewModalComponent", filePath: "src/app/features/documents/document-preview-modal.component.ts", lineNumber: 289 }); })();
//# sourceMappingURL=document-preview-modal.component.js.map