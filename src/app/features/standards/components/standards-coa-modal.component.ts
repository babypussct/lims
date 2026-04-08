import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standards-coa-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
      <!-- COA PREVIEW -->
      @if (previewUrl() || previewImgUrl()) {
          <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in" (click)="onClose()">
              <div class="relative w-full max-w-7xl h-[85vh] bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
                  <div class="bg-slate-900 dark:bg-slate-950 text-white p-3 flex justify-between items-center shrink-0">
                      <span class="text-sm font-bold pl-2"><i class="fa-solid fa-file-pdf mr-2"></i> Preview Certificate of Analysis</span>
                      <div class="flex gap-3">
                          <a [href]="previewRawUrl()" target="_blank" class="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition">Mở Tab mới</a>
                          <button (click)="onClose()" class="text-white hover:text-red-400 transition"><i class="fa-solid fa-times text-lg"></i></button>
                      </div>
                  </div>
                  <div class="flex-1 bg-slate-100 dark:bg-slate-800 relative">
                      @if(previewType() === 'image') { 
                          <div class="w-full h-full flex items-center justify-center overflow-auto"><img [src]="previewImgUrl()" class="max-w-full max-h-full object-contain shadow-lg"></div> 
                      } @else { 
                          <iframe [src]="previewUrl()" class="w-full h-full border-none"></iframe> 
                      }
                  </div>
              </div>
          </div>
      }
  `
})
export class StandardsCoaModalComponent {
  previewUrl = input<any>(null); // SafeResourceUrl
  previewImgUrl = input<any>(null); // SafeResourceUrl or string
  previewType = input<'iframe'|'image'>('iframe');
  previewRawUrl = input<string>('');
  
  closeModal = output<void>();

  onClose() {
    this.closeModal.emit();
  }
}
