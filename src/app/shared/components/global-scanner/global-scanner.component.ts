
import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrGlobalService } from '../../../core/services/qr-global.service';
import { QrScannerComponent } from '../qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-global-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, QrScannerComponent],
  template: `
    @if (qrService.isScanning()) {
      <div class="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm fade-in flex flex-col h-full animate-fade-in">
          
          <!-- Header -->
          <div class="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
              <button (click)="close()" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition hover:bg-white/30">
                  <i class="fa-solid fa-arrow-left"></i>
              </button>
              <div class="text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  Máy quét Thông minh
              </div>
              <div class="w-10"></div> <!-- Spacer -->
          </div>

          <!-- Scanner View -->
          <div class="flex-1 relative">
              <app-qr-scanner 
                  (scanSuccess)="onScanSuccess($event)" 
                  (scanError)="onScanError($event)">
              </app-qr-scanner>
          </div>

          <!-- Manual Input Footer -->
          <div class="bg-slate-900 border-t border-white/10 p-4 pb-8 md:pb-4 shrink-0">
              <div class="max-w-md mx-auto">
                  <p class="text-xs text-slate-400 text-center mb-2 font-medium">Hoặc nhập mã thủ công</p>
                  <div class="flex gap-2">
                      <input #manualInput
                             [(ngModel)]="manualCode" 
                             (keyup.enter)="onSubmitManual()"
                             class="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono font-bold outline-none focus:border-blue-500 transition placeholder-slate-600 uppercase"
                             placeholder="INV-001...">
                      <button (click)="onSubmitManual()" 
                              class="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-900/20">
                          <i class="fa-solid fa-arrow-right"></i>
                      </button>
                  </div>
              </div>
          </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class GlobalScannerComponent {
  qrService = inject(QrGlobalService);
  manualCode = '';

  close() {
    this.qrService.stopScan();
    this.manualCode = '';
  }

  onScanSuccess(code: string) {
    this.qrService.handleResult(code);
  }

  onScanError(err: any) {
    // Silent fail or simple log, scanner component handles UI feedback usually
  }

  onSubmitManual() {
    if (this.manualCode.trim()) {
      this.qrService.handleResult(this.manualCode);
      this.manualCode = '';
    }
  }
}
