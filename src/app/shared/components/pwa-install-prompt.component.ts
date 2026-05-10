import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Nút Cài đặt PWA -->
    <div class="text-center">
        <button (click)="triggerInstall()" class="inline-flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full text-fuchsia-600 font-semibold text-[12px] transition-colors shadow-sm border border-white/50">
            <i class="fa-solid fa-mobile-screen-button"></i> Hướng dẫn Cài đặt Ứng dụng
        </button>
    </div>

    <!-- Overlay & Tooltip -->
    @if (showTooltip()) {
        <div class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-fade-in" (click)="closeTooltip()">
            
            <!-- Tooltip cho iOS (Safari) - Chỉ xuống đáy -->
            @if (osType() === 'ios') {
                <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center" (click)="$event.stopPropagation()">
                    <div class="bg-white px-5 py-4 rounded-2xl shadow-2xl relative mb-4 max-w-[280px]">
                        <!-- Tam giác trỏ xuống -->
                        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                        
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <i class="fa-brands fa-safari"></i>
                            </div>
                            <div>
                                <p class="text-[13px] font-bold text-gray-700 mb-1">Cài đặt ứng dụng iOS</p>
                                <p class="text-[12px] text-gray-500 leading-relaxed">
                                    1. Nhấn nút <i class="fa-solid fa-arrow-up-from-bracket mx-1 text-blue-500"></i> ở dưới.<br>
                                    2. Chọn <strong>Thêm vào MH chính</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- Mũi tên nhảy báo hiệu vị trí -->
                    <div class="text-white text-3xl animate-bounce drop-shadow-md">
                        <i class="fa-solid fa-arrow-down"></i>
                    </div>
                </div>
            }

            <!-- Tooltip cho Android (nếu không có API tự động) - Chỉ lên góc phải -->
            @if (osType() === 'android') {
                <div class="absolute top-4 right-4 flex flex-col items-end" (click)="$event.stopPropagation()">
                    <!-- Mũi tên nhảy lên góc -->
                    <div class="text-white text-3xl animate-bounce drop-shadow-md mb-2 mr-2">
                        <i class="fa-solid fa-arrow-up"></i>
                    </div>
                    <div class="bg-white px-5 py-4 rounded-2xl shadow-2xl relative max-w-[280px]">
                        <!-- Tam giác trỏ lên góc -->
                        <div class="absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>
                        
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <i class="fa-brands fa-chrome"></i>
                            </div>
                            <div>
                                <p class="text-[13px] font-bold text-gray-700 mb-1">Cài đặt ứng dụng Android</p>
                                <p class="text-[12px] text-gray-500 leading-relaxed">
                                    1. Nhấn nút <i class="fa-solid fa-ellipsis-vertical mx-1 text-gray-600"></i> ở góc trên.<br>
                                    2. Chọn <strong>Cài đặt ứng dụng</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <!-- Nút đóng chung nếu người dùng click ra ngoài chưa ăn -->
            <button class="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-colors" (click)="closeTooltip()">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>

        </div>
    }
  `,
  styles: []
})
export class PwaInstallPromptComponent implements OnInit {
  osType = signal<'ios' | 'android' | 'other' | null>(null);
  showTooltip = signal(false);
  deferredPrompt: any;

  ngOnInit() {
    this.checkDeviceOS();
  }

  // Lắng nghe sự kiện cài đặt gốc của Chrome/Android
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: Event) {
    e.preventDefault(); // Ngăn Chrome hiện mini-infobar tự động
    this.deferredPrompt = e; // Lưu lại để gọi sau
    // Đảm bảo nút "Cài đặt" vẫn hiện
  }

  checkDeviceOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    // Phát hiện iOS (Safari)
    if (/iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream) {
      this.osType.set('ios');
    } 
    // Phát hiện Android
    else if (/android/.test(userAgent)) {
      this.osType.set('android');
    } 
    else {
      this.osType.set('other');
    }
  }

  async triggerInstall() {
    // Luồng 1: Nếu máy Android có sẵn Native Prompt
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt(); // Hiện popup cài đặt gốc
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      this.deferredPrompt = null;
    } 
    // Luồng 2: Fallback hiện Tooltip trỏ mũi tên
    else {
      this.showTooltip.set(true);
    }
  }

  closeTooltip() {
    this.showTooltip.set(false);
  }
}
