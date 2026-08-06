import { Injectable, inject, signal } from '@angular/core';
import { ToastService } from './toast.service';
import { GoogleDriveService } from './google-drive.service';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import * as i0 from "@angular/core";
export class PrintService {
    constructor() {
        this.pendingPreviewKey = '__gd_pending_pdf_preview';
        this.toast = inject(ToastService);
        this.googleDriveService = inject(GoogleDriveService);
        // Operations state
        this.isPrinting = signal(false);
        this.isDownloading = signal(false);
        // Loading state
        this.isProcessing = signal(false);
        // PREVIEW STATE (Used by Modal)
        this.isPreviewOpen = signal(false);
        this.previewJobs = signal([]);
        // NEW PDF VIEWING STATE
        this.isPreviewPdfOpen = signal(false);
        this.pdfUrl = signal(null);
        this.pdfBlobUrl = signal(null);
        this.isPdfBlobLoading = signal(false);
        this.docsUrl = signal(null);
        this.pdfTitle = signal('');
        this.pdfVersion = signal(1);
        this.pdfAnalyst = signal('Chưa rõ');
        this.pdfPublishDate = signal(null);
        this.pdfPreviewType = signal('iframe');
        this.onRepublishCallback = signal(null);
        // Default Options
        this.defaultOptions = {
            showHeader: true,
            showFooter: true,
            showSignature: true,
            showCutLine: true
        };
        this.restorePendingPdfPreview();
    }
    // --- 1. ENTRY POINT: OPEN PREVIEW ---
    openPreview(jobs) {
        if (!jobs || jobs.length === 0) {
            this.toast.show('Không có dữ liệu để in.', 'error');
            return;
        }
        this.previewJobs.set(jobs);
        this.isPreviewOpen.set(true);
    }
    closePreview() {
        this.isPreviewOpen.set(false);
        this.previewJobs.set([]);
    }
    // --- 2. ENTRY POINT: OPEN PDF CLOUD PREVIEW ---
    openPdfPreview(url, title, version, analyst, publishDate, onRepublish, previewType = 'iframe', docsUrl) {
        this.pdfUrl.set(url);
        const docsPreviewUrl = docsUrl ? docsUrl.replace(/\/edit.*$/, '/preview') : null;
        this.docsUrl.set(docsPreviewUrl);
        this.pdfTitle.set(title);
        this.pdfVersion.set(version);
        this.pdfAnalyst.set(analyst);
        this.pdfPublishDate.set(publishDate);
        this.pdfPreviewType.set(previewType);
        if (onRepublish) {
            this.onRepublishCallback.set(onRepublish);
        }
        else {
            this.onRepublishCallback.set(null);
        }
        this.isPreviewPdfOpen.set(true);
        // Load Blob URL for iframe to avoid Google Drive CSP frame restrictions
        if (previewType === 'iframe') {
            this.loadPdfBlobForPreview(url);
        }
        else {
            this.pdfBlobUrl.set(url); // For images, standard URL is usually fine
        }
    }
    // --- 3. ENTRY POINT: OPEN COA PREVIEW ---
    openCoaPreview(url, title = 'Certificate of Analysis') {
        if (!url)
            return;
        const cleanUrl = url.split('?')[0].toLowerCase();
        const isImage = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/.test(cleanUrl);
        this.openPdfPreview(url, title, 0, 'Hệ thống', null, undefined, isImage ? 'image' : 'iframe');
    }
    closePdfPreview() {
        this.isPreviewPdfOpen.set(false);
        this.pdfUrl.set(null);
        // Cleanup Blob URL
        const currentBlob = this.pdfBlobUrl();
        if (currentBlob && currentBlob.startsWith('blob:')) {
            URL.revokeObjectURL(currentBlob);
        }
        this.pdfBlobUrl.set(null);
        this.isPdfBlobLoading.set(false);
        this.docsUrl.set(null);
        this.onRepublishCallback.set(null);
    }
    /** Restores the document after redirect OAuth returns to the application. */
    restorePendingPdfPreview() {
        const raw = sessionStorage.getItem(this.pendingPreviewKey);
        if (!raw)
            return;
        sessionStorage.removeItem(this.pendingPreviewKey);
        try {
            const pending = JSON.parse(raw);
            if (!pending?.url)
                return;
            this.openPdfPreview(pending.url, pending.title || 'Tài liệu', pending.version || 1, pending.analyst || 'Chưa rõ', pending.publishDate ?? null, undefined, pending.previewType === 'image' ? 'image' : 'iframe', pending.docsUrl);
        }
        catch (error) {
            console.warn('[Preview] Cannot restore preview after OAuth redirect:', error);
        }
    }
    persistPendingPdfPreview(pdfUrl) {
        sessionStorage.setItem(this.pendingPreviewKey, JSON.stringify({
            url: pdfUrl,
            title: this.pdfTitle(),
            version: this.pdfVersion(),
            analyst: this.pdfAnalyst(),
            publishDate: this.pdfPublishDate(),
            previewType: this.pdfPreviewType(),
            docsUrl: this.docsUrl()
        }));
    }
    // --- FETCH BLOB FOR PREVIEW (Bypass Google iframe CSP) ---
    // This runs automatically and only calls the same-origin Drive proxy. If
    // authorization is missing, the modal shows an explicit redirect button.
    async loadPdfBlobForPreview(pdfUrl) {
        const id = this.getFileId(pdfUrl);
        if (!id) {
            this.pdfBlobUrl.set(pdfUrl);
            return;
        }
        this.isPdfBlobLoading.set(true);
        try {
            // Download through the same-origin server proxy. Google access and
            // refresh tokens remain in an encrypted HttpOnly cookie.
            let rawBlob;
            try {
                rawBlob = await this.googleDriveService.downloadFile(id);
            }
            catch (downloadErr) {
                if (downloadErr?.code === 'oauth_required') {
                    console.log('[Preview] Server OAuth session required.');
                    return;
                }
                const is401 = downloadErr.message?.includes('401') ||
                    downloadErr.message?.toLowerCase().includes('invalid authentication') ||
                    downloadErr.message?.toLowerCase().includes('invalid credential');
                if (is401) {
                    // Token hết hạn hoặc bị thu hồi → xóa cache, yêu cầu user xác thực lại
                    console.warn('[Preview] 401 — stale token cleared. User must re-authenticate.');
                    this.googleDriveService.clearSession();
                    this.isPdfBlobLoading.set(false);
                    return; // UI hiện nút "Xác thực & Tải lại"
                }
                throw downloadErr;
            }
            const blob = new Blob([rawBlob], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            if (this.isPreviewPdfOpen() && this.pdfUrl() === pdfUrl) {
                this.pdfBlobUrl.set(blobUrl);
                sessionStorage.removeItem(this.pendingPreviewKey);
            }
            else {
                URL.revokeObjectURL(blobUrl);
            }
        }
        catch (err) {
            console.error('[Preview] Failed to load PDF blob:', err);
            // pdfBlobUrl = null → UI hiện nút retry
        }
        finally {
            this.isPdfBlobLoading.set(false);
        }
    }
    // Called by "Xác thực & Tải lại". Authorization happens in the top-level
    // browser window through the server-side OAuth code flow.
    async retryLoadPdfBlob() {
        const pdfUrl = this.pdfUrl();
        if (!pdfUrl)
            return;
        const id = this.getFileId(pdfUrl);
        if (!id)
            return;
        this.persistPendingPdfPreview(pdfUrl);
        this.isPdfBlobLoading.set(true);
        try {
            const hasServerSession = await this.googleDriveService.hasServerOAuthSession();
            if (!hasServerSession) {
                this.googleDriveService.beginRedirectAuth();
                return;
            }
            const rawBlob = await this.googleDriveService.downloadFile(id);
            const blob = new Blob([rawBlob], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            if (this.isPreviewPdfOpen() && this.pdfUrl() === pdfUrl) {
                this.pdfBlobUrl.set(blobUrl);
                sessionStorage.removeItem(this.pendingPreviewKey);
            }
            else {
                URL.revokeObjectURL(blobUrl);
            }
        }
        catch (err) {
            this.toast.show('Xác thực thất bại: ' + (err.message || 'Không xác định'), 'error');
        }
        finally {
            this.isPdfBlobLoading.set(false);
        }
    }
    getFileId(url) {
        if (!url)
            return null;
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    }
    async quickPrint(pdfUrl) {
        const id = this.getFileId(pdfUrl);
        if (!id) {
            openInNewTab(pdfUrl);
            return;
        }
        // If we already loaded the blob for preview, reuse it!
        if (this.pdfUrl() === pdfUrl && this.pdfBlobUrl()?.startsWith('blob:')) {
            this.printBlobUrl(this.pdfBlobUrl());
            return;
        }
        if (!await this.googleDriveService.hasServerOAuthSession()) {
            this.persistPendingPdfPreview(pdfUrl);
            this.googleDriveService.beginRedirectAuth();
            return;
        }
        try {
            this.isPrinting.set(true);
            this.toast.show('Đang chuẩn bị dữ liệu in...', 'info');
            const rawBlob = await this.googleDriveService.downloadFile(id);
            const blob = new Blob([rawBlob], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            this.printBlobUrl(blobUrl, true);
        }
        catch (err) {
            console.error('[Print] Lỗi khi in nhanh:', err);
            this.toast.show('Không thể tải PDF để in. Đang mở bản xem trước...', 'warning');
            this.openPdfPreview(pdfUrl, 'Báo cáo (Cần in thủ công)', 1, 'Hệ thống', null, undefined, 'iframe');
        }
        finally {
            this.isPrinting.set(false);
        }
    }
    printBlobUrl(blobUrl, autoRevoke = false) {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.onload = () => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => {
                if (document.body.contains(iframe))
                    document.body.removeChild(iframe);
                if (autoRevoke)
                    URL.revokeObjectURL(blobUrl);
            }, 60000);
        };
    }
    async quickDownload(pdfUrl, fileName = 'document.pdf') {
        const id = this.getFileId(pdfUrl);
        if (!id) {
            openInNewTab(pdfUrl);
            return;
        }
        // If we already loaded the blob for preview, reuse it!
        if (this.pdfUrl() === pdfUrl && this.pdfBlobUrl()?.startsWith('blob:')) {
            this.downloadBlobUrl(this.pdfBlobUrl(), fileName);
            return;
        }
        if (!await this.googleDriveService.hasServerOAuthSession()) {
            this.persistPendingPdfPreview(pdfUrl);
            this.googleDriveService.beginRedirectAuth();
            return;
        }
        try {
            this.isDownloading.set(true);
            this.toast.show('Đang tải dữ liệu, vui lòng đợi...', 'info');
            const blob = await this.googleDriveService.downloadFile(id);
            const blobUrl = URL.createObjectURL(blob);
            this.downloadBlobUrl(blobUrl, fileName, true);
        }
        catch (err) {
            console.error('[Download] Failed to download silently:', err);
            this.toast.show('Không thể tải tài liệu từ Google Drive.', 'error');
        }
        finally {
            this.isDownloading.set(false);
        }
    }
    downloadBlobUrl(blobUrl, fileName, autoRevoke = false) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            if (document.body.contains(a))
                document.body.removeChild(a);
            if (autoRevoke)
                URL.revokeObjectURL(blobUrl);
        }, 1000);
    }
    static { this.ɵfac = function PrintService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PrintService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PrintService, factory: PrintService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PrintService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [], null); })();
//# sourceMappingURL=print.service.js.map