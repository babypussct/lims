import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ensureHtml5Qrcode } from '../../utils/external-script-loader';
import * as i0 from "@angular/core";
function QrScannerComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 10)(1, "span", 11);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.statusMsg(), " ");
} }
export class QrScannerComponent {
    constructor() {
        this.scanSuccess = output();
        this.scanError = output();
        this.statusMsg = signal('');
        this.isScanning = false;
    }
    ngAfterViewInit() {
        this.startCamera();
    }
    ngOnDestroy() {
        this.stopCamera();
    }
    async startCamera() {
        let Html5Qrcode;
        let Html5QrcodeSupportedFormats;
        try {
            const qrLib = await ensureHtml5Qrcode();
            Html5Qrcode = qrLib.Html5Qrcode;
            Html5QrcodeSupportedFormats = qrLib.Html5QrcodeSupportedFormats;
        }
        catch (err) {
            console.error("Scanner library load error:", err);
            this.statusMsg.set('Không thể tải thư viện quét mã. Vui lòng kiểm tra kết nối mạng.');
            return;
        }
        try {
            let formatsToSupport = undefined;
            if (typeof Html5QrcodeSupportedFormats !== 'undefined') {
                formatsToSupport = [
                    Html5QrcodeSupportedFormats.QR_CODE,
                    Html5QrcodeSupportedFormats.DATA_MATRIX,
                    Html5QrcodeSupportedFormats.CODE_128,
                    Html5QrcodeSupportedFormats.CODE_39,
                    Html5QrcodeSupportedFormats.EAN_13,
                    Html5QrcodeSupportedFormats.EAN_8,
                    Html5QrcodeSupportedFormats.UPC_A,
                    Html5QrcodeSupportedFormats.UPC_E,
                    Html5QrcodeSupportedFormats.ITF
                ];
            }
            this.html5QrCode = new Html5Qrcode("reader", formatsToSupport ? { formatsToSupport } : undefined);
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };
            // Prefer back camera (environment)
            await this.html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => this.onScanSuccess(decodedText), (errorMessage) => {
                // Ignore minor scanning errors frame-by-frame
            });
            this.isScanning = true;
        }
        catch (err) {
            console.error("Camera Error:", err);
            if (err?.name === 'NotAllowedError') {
                this.statusMsg.set('Vui lòng cấp quyền Camera trong cài đặt trình duyệt.');
            }
            else if (err?.name === 'NotFoundError') {
                this.statusMsg.set('Không tìm thấy Camera trên thiết bị.');
            }
            else {
                this.statusMsg.set('Không thể mở Camera. ' + (err.message || ''));
            }
            this.scanError.emit(err);
        }
    }
    async stopCamera() {
        if (this.html5QrCode && this.isScanning) {
            try {
                await this.html5QrCode.stop();
                this.html5QrCode.clear();
                this.isScanning = false;
            }
            catch (e) {
                console.warn("Failed to stop camera", e);
            }
        }
    }
    onScanSuccess(decodedText) {
        if (!decodedText)
            return;
        // Play Beep Sound
        this.playBeep();
        // Vibrate if supported
        if (navigator.vibrate)
            navigator.vibrate(200);
        // Stop camera immediately to prevent duplicate scans
        this.stopCamera();
        // Emit result
        this.scanSuccess.emit(decodedText);
    }
    playBeep() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext)
            return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 800; // Hz
        gain.gain.value = 0.1; // Volume
        osc.start();
        setTimeout(() => {
            osc.stop();
            ctx.close();
        }, 100); // 100ms beep
    }
    static { this.ɵfac = function QrScannerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QrScannerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QrScannerComponent, selectors: [["app-qr-scanner"]], outputs: { scanSuccess: "scanSuccess", scanError: "scanError" }, decls: 12, vars: 1, consts: [[1, "flex", "flex-col", "h-full", "bg-black", "relative", "rounded-2xl", "overflow-hidden"], [1, "absolute", "inset-0", "z-10", "pointer-events-none", "flex", "flex-col", "items-center", "justify-center"], [1, "w-64", "h-64", "border-2", "border-white/50", "rounded-3xl", "relative", "shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]"], [1, "absolute", "top-0", "left-0", "w-6", "h-6", "border-t-4", "border-l-4", "border-blue-500", "rounded-tl-xl", "-mt-1", "-ml-1"], [1, "absolute", "top-0", "right-0", "w-6", "h-6", "border-t-4", "border-r-4", "border-blue-500", "rounded-tr-xl", "-mt-1", "-mr-1"], [1, "absolute", "bottom-0", "left-0", "w-6", "h-6", "border-b-4", "border-l-4", "border-blue-500", "rounded-bl-xl", "-mb-1", "-ml-1"], [1, "absolute", "bottom-0", "right-0", "w-6", "h-6", "border-b-4", "border-r-4", "border-blue-500", "rounded-br-xl", "-mb-1", "-mr-1"], [1, "absolute", "inset-x-0", "h-0.5", "bg-red-500/80", "shadow-[0_0_10px_rgba(239,68,68,0.8)]", "animate-scan", "top-1/2"], [1, "text-white/80", "text-xs", "font-bold", "mt-6", "bg-black/50", "px-3", "py-1", "rounded-full"], ["id", "reader", 1, "w-full", "h-full", "object-cover"], [1, "absolute", "bottom-20", "left-4", "right-4", "z-20", "text-center"], [1, "bg-red-500/90", "text-white", "px-4", "py-2", "rounded-lg", "text-xs", "font-bold", "shadow-lg", "block"]], template: function QrScannerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵelement(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 8);
            i0.ɵɵtext(9, "\u0110\u1EB7t m\u00E3 QR v\u00E0o khung");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(10, "div", 9);
            i0.ɵɵtemplate(11, QrScannerComponent_Conditional_11_Template, 3, 1, "div", 10);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵconditional(ctx.statusMsg() ? 11 : -1);
        } }, dependencies: [CommonModule], styles: ["@keyframes _ngcontent-%COMP%_scan {\n        0% { transform: translateY(-120px); opacity: 0; }\n        10% { opacity: 1; }\n        90% { opacity: 1; }\n        100% { transform: translateY(120px); opacity: 0; }\n    }\n    .animate-scan[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_scan 2s linear infinite; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QrScannerComponent, [{
        type: Component,
        args: [{ selector: 'app-qr-scanner', standalone: true, imports: [CommonModule], template: `
    <div class="flex flex-col h-full bg-black relative rounded-2xl overflow-hidden">
        <!-- Viewfinder Overlay -->
        <div class="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
            <div class="w-64 h-64 border-2 border-white/50 rounded-3xl relative shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
                <!-- Corners -->
                <div class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl -mt-1 -ml-1"></div>
                <div class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl -mt-1 -mr-1"></div>
                <div class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl -mb-1 -ml-1"></div>
                <div class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl -mb-1 -mr-1"></div>
                
                <!-- Scanning Line Animation -->
                <div class="absolute inset-x-0 h-0.5 bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-scan top-1/2"></div>
            </div>
            <p class="text-white/80 text-xs font-bold mt-6 bg-black/50 px-3 py-1 rounded-full">Đặt mã QR vào khung</p>
        </div>

        <!-- Camera Feed Container -->
        <div id="reader" class="w-full h-full object-cover"></div>

        <!-- Error / Status Message -->
        @if (statusMsg()) {
            <div class="absolute bottom-20 left-4 right-4 z-20 text-center">
                <span class="bg-red-500/90 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg block">
                    {{statusMsg()}}
                </span>
            </div>
        }
    </div>
  `, styles: ["\n    @keyframes scan {\n        0% { transform: translateY(-120px); opacity: 0; }\n        10% { opacity: 1; }\n        90% { opacity: 1; }\n        100% { transform: translateY(120px); opacity: 0; }\n    }\n    .animate-scan { animation: scan 2s linear infinite; }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(QrScannerComponent, { className: "QrScannerComponent", filePath: "src/app/shared/components/qr-scanner/qr-scanner.component.ts", lineNumber: 49 }); })();
//# sourceMappingURL=qr-scanner.component.js.map