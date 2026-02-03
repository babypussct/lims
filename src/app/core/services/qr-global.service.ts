
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class QrGlobalService {
  private router = inject(Router);
  private toast = inject(ToastService);
  private state = inject(StateService);

  // State visibility of the scanner overlay
  isScanning = signal<boolean>(false);

  startScan() {
    this.isScanning.set(true);
  }

  stopScan() {
    this.isScanning.set(false);
  }

  /**
   * Central Logic to handle scanned codes
   */
  handleResult(rawValue: string) {
    if (!rawValue) return;
    
    // 1. Close scanner immediately
    this.stopScan();
    
    // 2. Clean & Parse
    let code = rawValue.trim();
    
    // Handle URL format (e.g. from printed QR containing full URL)
    if (code.includes('http') || code.includes('://')) {
        try {
            // Support: domain/#/traceability/ID
            if (code.includes('#/traceability/')) {
                code = code.split('#/traceability/')[1].split('?')[0].split('/')[0];
            } 
            // Support: ?id=ID
            else if (code.includes('id=')) {
                code = new URL(code).searchParams.get('id') || code;
            }
        } catch (e) { console.warn("URL Parse Error", e); }
    }

    const cleanCode = code.toUpperCase();
    this.toast.show(`Đang xử lý: ${cleanCode}`, 'info');

    // 3. Smart Routing Strategy
    
    // CASE A: Auth Handshake (Mobile Login)
    if (cleanCode.startsWith('SESS_')) {
        this.router.navigate(['/mobile-login']); 
        return;
    }

    // CASE B: Traceability (Requests, Logs, Print Jobs)
    if (cleanCode.startsWith('TRC-') || cleanCode.startsWith('REQ-') || cleanCode.startsWith('LOG-') || cleanCode.toLowerCase().startsWith('log_')) {
        this.router.navigate(['/traceability', code]); // Keep original case for ID
        return;
    }

    // CASE C: Inventory Item
    if (cleanCode.startsWith('INV-') || cleanCode.startsWith('CH-')) {
        this.router.navigate(['/inventory'], { queryParams: { search: code } });
        return;
    }

    // CASE D: Reference Standard
    if (cleanCode.startsWith('STD-')) {
        this.router.navigate(['/standards'], { queryParams: { search: code } });
        return;
    }

    // CASE E: SOP / Procedure
    if (cleanCode.startsWith('SOP-')) {
        // Option 1: Open Calculator with this SOP selected (if ID matches)
        // Option 2: Search in Library
        // We'll search in library for flexibility
        this.router.navigate(['/calculator'], { queryParams: { search: code } });
        return;
    }

    // CASE F: Recipe
    if (cleanCode.startsWith('RCP-')) {
        this.router.navigate(['/recipes'], { queryParams: { search: code } });
        return;
    }

    // CASE G: User Config
    if (cleanCode.startsWith('USR-')) {
        this.router.navigate(['/config']);
        return;
    }

    // CASE H: Fallback (Default Search in Inventory)
    // If it looks like a number or generic string, try inventory
    this.router.navigate(['/inventory'], { queryParams: { search: code } });
  }
}
