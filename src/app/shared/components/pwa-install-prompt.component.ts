import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type OsType = 'ios_safari_phone' | 'ios_safari_ipad' | 'ios_chrome' | 'mac_safari' | 'android' | 'pc_other' | null;

@Component({
  selector: 'app-pwa-install-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!isStandalone()) {
      <!-- Nút Cài đặt PWA -->
      <div class="text-center">
          <button (click)="triggerInstall()" class="inline-flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full text-fuchsia-600 font-semibold text-[12px] transition-colors shadow-sm border border-white/50">
              <i class="fa-solid fa-mobile-screen-button"></i> Hướng dẫn Cài đặt Ứng dụng
          </button>
      </div>

      <!-- Overlay & Tooltip -->
      @if (showTooltip()) {
          <div class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-fade-in" (click)="closeTooltip()">
              
              <!-- 1. iPhone Safari: Chỉ xuống đáy -->
              @if (osType() === 'ios_safari_phone') {
                  <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center" (click)="$event.stopPropagation()">
                      <div class="bg-white px-5 py-4 rounded-2xl shadow-2xl relative mb-4 max-w-[280px]">
                          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
                          
                          <div class="flex items-start gap-3">
                              <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <i class="fa-brands fa-safari"></i>
                              </div>
                              <div>
                                  <p class="text-[13px] font-bold text-gray-700 mb-1">Cài đặt trên iPhone</p>
                                  <p class="text-[12px] text-gray-500 leading-relaxed">
                                      1. Nhấn nút <i class="fa-solid fa-arrow-up-from-bracket mx-1 text-blue-500"></i> ở dưới.<br>
                                      2. Chọn <strong>Thêm vào MH chính</strong>.
                                  </p>
                              </div>
                          </div>
                      </div>
                      <div class="text-white text-3xl animate-bounce drop-shadow-md">
                          <i class="fa-solid fa-arrow-down"></i>
                      </div>
                  </div>
              }

              <!-- 2. iPad Safari, iPhone Chrome, Android (Dự phòng): Chỉ lên góc phải -->
              @if (osType() === 'ios_safari_ipad' || osType() === 'ios_chrome' || osType() === 'android') {
                  <div class="absolute top-4 right-4 flex flex-col items-end" (click)="$event.stopPropagation()">
                      <div class="text-white text-3xl animate-bounce drop-shadow-md mb-2 mr-2">
                          <i class="fa-solid fa-arrow-up"></i>
                      </div>
                      <div class="bg-white px-5 py-4 rounded-2xl shadow-2xl relative max-w-[280px]">
                          <div class="absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>
                          
                          <div class="flex items-start gap-3">
                              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                   [class.bg-green-50]="osType() === 'android'" [class.text-green-500]="osType() === 'android'"
                                   [class.bg-blue-50]="osType() !== 'android'" [class.text-blue-500]="osType() !== 'android'">
                                  <i class="fa-brands" [class.fa-chrome]="osType() === 'android' || osType() === 'ios_chrome'" [class.fa-safari]="osType() === 'ios_safari_ipad'"></i>
                              </div>
                              <div>
                                  <p class="text-[13px] font-bold text-gray-700 mb-1">Cài đặt Ứng dụng</p>
                                  <p class="text-[12px] text-gray-500 leading-relaxed">
                                      @if (osType() === 'ios_safari_ipad') {
                                        1. Nhấn nút <i class="fa-solid fa-arrow-up-from-bracket mx-1 text-blue-500"></i> ở góc trên.<br>
                                        2. Chọn <strong>Thêm vào MH chính</strong>.
                                      } @else {
                                        1. Nhấn nút <i class="fa-solid fa-ellipsis-vertical mx-1 text-gray-600"></i> (hoặc Chia sẻ) ở góc trên.<br>
                                        2. Chọn <strong>Thêm vào MH chính</strong> / <strong>Cài đặt App</strong>.
                                      }
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              }

              <!-- 3. Mac Safari & PC Desktop: Hộp thoại ở giữa -->
              @if (osType() === 'mac_safari' || osType() === 'pc_other') {
                  <div class="fixed inset-0 flex items-center justify-center pointer-events-none" (click)="$event.stopPropagation()">
                      <div class="bg-white px-6 py-5 rounded-3xl shadow-2xl max-w-[320px] pointer-events-auto border border-gray-100">
                          <div class="flex items-start gap-4">
                              <div class="w-12 h-12 rounded-full bg-fuchsia-50 text-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-1">
                                  <i class="fa-solid fa-display text-xl"></i>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-700 text-[15px] mb-2">Cài đặt trên Máy tính</h4>
                                  <p class="text-[13px] text-gray-500 leading-relaxed">
                                      @if (osType() === 'mac_safari') {
                                        Từ bản macOS Sonoma, bạn có thể cài app bằng cách chọn <strong>Tệp (File) > Thêm vào Dock</strong> trên menu của Safari.
                                      } @else {
                                        Nhấn biểu tượng màn hình/tải xuống ở góc thanh địa chỉ trình duyệt, hoặc mở <strong>Menu > Cài đặt ứng dụng</strong> để tải LIMS vào máy tính.
                                      }
                                  </p>
                              </div>
                          </div>
                          <button (click)="closeTooltip()" class="w-full mt-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-[13px]">Đã hiểu</button>
                      </div>
                  </div>
              }

              <!-- Nút đóng chung nếu người dùng click ra ngoài chưa ăn -->
              <button class="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-colors" (click)="closeTooltip()">
                  <i class="fa-solid fa-xmark text-xl"></i>
              </button>

          </div>
      }
    }
  `,
  styles: []
})
export class PwaInstallPromptComponent implements OnInit {
  osType = signal<OsType>(null);
  showTooltip = signal(false);
  isStandalone = signal(false);
  deferredPrompt: any;

  ngOnInit() {
    this.checkStandaloneMode();
    this.checkDeviceOS();
  }

  // Lắng nghe sự kiện cài đặt gốc của Chrome/Android/Desktop
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: Event) {
    e.preventDefault(); 
    this.deferredPrompt = e; 
  }

  checkStandaloneMode() {
    // Nếu người dùng đang mở trang từ PWA App thì ẩn nút đi
    const isPwa = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    this.isStandalone.set(isPwa);
  }

  checkDeviceOS() {
    const ua = window.navigator.userAgent.toLowerCase();
    
    // 1. Apple Devices
    if (/iphone|ipod/.test(ua)) {
      if (/crios|fxios/.test(ua)) {
        this.osType.set('ios_chrome'); // Chrome/Firefox on iPhone -> Top right
      } else {
        this.osType.set('ios_safari_phone'); // Safari on iPhone -> Bottom center
      }
    } 
    else if (/ipad/.test(ua) || (/macintosh/.test(ua) && navigator.maxTouchPoints > 1)) {
      if (/crios|fxios/.test(ua)) {
        this.osType.set('ios_chrome'); // Chrome on iPad
      } else {
        this.osType.set('ios_safari_ipad'); // Safari on iPad -> Top right
      }
    }
    else if (/macintosh/.test(ua) && navigator.maxTouchPoints <= 1) {
      if (/chrome|edg/.test(ua)) {
        this.osType.set('pc_other'); // Chrome on Mac -> beforeinstallprompt or address bar
      } else {
        this.osType.set('mac_safari'); // Safari on Mac Desktop -> File > Add to Dock
      }
    }
    // 2. Android Devices
    else if (/android/.test(ua)) {
      this.osType.set('android'); // Chrome/Other on Android
    } 
    // 3. Other PC
    else {
      this.osType.set('pc_other'); // Windows, Linux...
    }
  }

  async triggerInstall() {
    // Nếu bắt được Native Prompt (Android Chrome, PC Chrome) -> Tự động gọi Native Popup
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt(); 
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      this.deferredPrompt = null;
    } 
    // Nếu không bắt được (iOS, Mac Safari, PC Firefox...) -> Hiện Tooltip
    else {
      this.showTooltip.set(true);
    }
  }

  closeTooltip() {
    this.showTooltip.set(false);
  }
}
