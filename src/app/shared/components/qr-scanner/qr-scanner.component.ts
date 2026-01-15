import { Component, output, OnDestroy, AfterViewInit, signal, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var Html5Qrcode: any;

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule],
  template: `
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
  `,
  styles: [`
    @keyframes scan {
        0% { transform: translateY(-120px); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(120px); opacity: 0; }
    }
    .animate-scan { animation: scan 2s linear infinite; }
  `]
})
export class QrScannerComponent implements AfterViewInit, OnDestroy {
  scanSuccess = output<string>();
  scanError = output<string>();
  
  statusMsg = signal('');
  private html5QrCode: any;
  private isScanning = false;

  ngAfterViewInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    if (typeof Html5Qrcode === 'undefined') {
        this.statusMsg.set('Lỗi: Thư viện Scanner chưa tải.');
        return;
    }

    try {
        this.html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
        
        // Prefer back camera (environment)
        await this.html5QrCode.start(
            { facingMode: "environment" }, 
            config, 
            (decodedText: string) => this.onScanSuccess(decodedText),
            (errorMessage: string) => {
                // Ignore minor scanning errors frame-by-frame
            }
        );
        this.isScanning = true;
    } catch (err: any) {
        console.error("Camera Error:", err);
        if (err?.name === 'NotAllowedError') {
            this.statusMsg.set('Vui lòng cấp quyền Camera trong cài đặt trình duyệt.');
        } else if (err?.name === 'NotFoundError') {
            this.statusMsg.set('Không tìm thấy Camera trên thiết bị.');
        } else {
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
          } catch (e) {
              console.warn("Failed to stop camera", e);
          }
      }
  }

  private onScanSuccess(decodedText: string) {
      if (!decodedText) return;
      
      // Play Beep Sound
      this.playBeep();
      
      // Vibrate if supported
      if (navigator.vibrate) navigator.vibrate(200);

      // Stop camera immediately to prevent duplicate scans
      this.stopCamera();
      
      // Emit result
      this.scanSuccess.emit(decodedText);
  }

  private playBeep() {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
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
}
