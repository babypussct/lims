import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { openInNewTab } from '../../shared/utils/browser-navigation';
import * as i0 from "@angular/core";
export class ReportService {
    constructor() {
        this.http = inject(HttpClient);
        /** URL của GAS Web App — deploy xong paste vào environment.gasReportUrl */
        this.GAS_URL = environment.gasReportUrl || '';
    }
    /**
     * Tạo báo cáo PDF từ dữ liệu nhập kết quả.
     * GAS sẽ: copy template → điền data → export PDF → lưu Drive → trả URL
     */
    async generateReport(payload) {
        if (!this.GAS_URL) {
            throw new Error('Chưa cấu hình GAS Web App URL. ' +
                'Vui lòng triển khai Google Apps Script và điền URL vào environment.gasReportUrl.');
        }
        // GAS Web App không nhận Content-Type: application/json trực tiếp
        // Cần gửi dưới dạng text/plain để tránh CORS preflight
        const result = await firstValueFrom(this.http.post(this.GAS_URL, JSON.stringify(payload), {
            headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
        }));
        if (!result.success) {
            throw new Error(result.error || 'Lỗi không xác định từ GAS');
        }
        return result;
    }
    /**
     * Yêu cầu GAS lưu trữ và dọn dẹp các tệp cũ bị hủy
     */
    async archiveReports(files) {
        if (!this.GAS_URL) {
            throw new Error('Chưa cấu hình GAS Web App URL.');
        }
        const payload = {
            action: 'archive_reports',
            files: files.filter(f => f.pdfUrl || f.docsUrl)
        };
        if (payload.files.length === 0)
            return { success: true };
        const result = await firstValueFrom(this.http.post(this.GAS_URL, JSON.stringify(payload), {
            headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
        }));
        return result;
    }
    /**
     * Mở PDF trong tab mới để xem/in.
     */
    openPdf(result) {
        openInNewTab(result.pdfViewUrl || result.pdfUrl);
    }
    /**
     * Build payload chuẩn cho filebieumau2 (Trifluralin GC-MS).
     * Dùng làm reference để xây cho các SOP khác.
     */
    buildTrifluralinPayload(batchCode, metadata, samples) {
        return {
            action: 'generate_pdf',
            sopId: 'trifluralin-gcms',
            metadata: {
                ...metadata,
                batchCode,
            },
            samples,
        };
    }
    /**
     * Tải tệp Excel gốc lên Google Drive của mẻ chạy qua Apps Script Web App.
     * Callback tiến trình chỉ phản ánh phần dữ liệu đã được trình duyệt gửi đi.
     */
    async uploadExcelToDrive(requestId, fileName, base64Data, sopId, onProgress) {
        if (!this.GAS_URL) {
            throw new Error('Chưa cấu hình GAS Web App URL.');
        }
        const payload = {
            action: 'upload_excel',
            requestId,
            fileName,
            fileData: base64Data,
            sopId
        };
        return firstValueFrom(this.http.post(this.GAS_URL, JSON.stringify(payload), {
            headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
            observe: 'events',
            reportProgress: true
        }).pipe(tap(event => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
                onProgress?.(Math.round((event.loaded / event.total) * 100));
            }
        }), filter((event) => event.type === HttpEventType.Response), map(event => event.body)));
    }
    static { this.ɵfac = function ReportService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ReportService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ReportService, factory: ReportService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReportService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
//# sourceMappingURL=report.service.js.map