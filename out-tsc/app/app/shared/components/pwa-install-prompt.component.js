import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 10);
    i0.ɵɵlistener("click", function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_1_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r4); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "div", 11);
    i0.ɵɵelement(2, "div", 12);
    i0.ɵɵelementStart(3, "div", 13)(4, "div", 14);
    i0.ɵɵelement(5, "i", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div")(7, "p", 16);
    i0.ɵɵtext(8, "C\u00E0i \u0111\u1EB7t tr\u00EAn iPhone");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 17);
    i0.ɵɵtext(10, " 1. Nh\u1EA5n n\u00FAt ");
    i0.ɵɵelement(11, "i", 18);
    i0.ɵɵtext(12, " \u1EDF d\u01B0\u1EDBi.");
    i0.ɵɵelement(13, "br");
    i0.ɵɵtext(14, " 2. Ch\u1ECDn ");
    i0.ɵɵelementStart(15, "strong");
    i0.ɵɵtext(16, "Th\u00EAm v\u00E0o MH ch\u00EDnh");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17, ". ");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(18, "div", 19);
    i0.ɵɵelement(19, "i", 20);
    i0.ɵɵelementEnd()();
} }
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_2_Conditional_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " 1. Nh\u1EA5n n\u00FAt ");
    i0.ɵɵelement(1, "i", 18);
    i0.ɵɵtext(2, " \u1EDF g\u00F3c tr\u00EAn.");
    i0.ɵɵelement(3, "br");
    i0.ɵɵtext(4, " 2. Ch\u1ECDn ");
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6, "Th\u00EAm v\u00E0o MH ch\u00EDnh");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, ". ");
} }
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_2_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " 1. Nh\u1EA5n n\u00FAt ");
    i0.ɵɵelement(1, "i", 28);
    i0.ɵɵtext(2, " (ho\u1EB7c Chia s\u1EBB) \u1EDF g\u00F3c tr\u00EAn.");
    i0.ɵɵelement(3, "br");
    i0.ɵɵtext(4, " 2. Ch\u1ECDn ");
    i0.ɵɵelementStart(5, "strong");
    i0.ɵɵtext(6, "Th\u00EAm v\u00E0o MH ch\u00EDnh");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(7, " / ");
    i0.ɵɵelementStart(8, "strong");
    i0.ɵɵtext(9, "C\u00E0i \u0111\u1EB7t App");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, ". ");
} }
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21);
    i0.ɵɵlistener("click", function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_2_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r5); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "div", 22);
    i0.ɵɵelement(2, "i", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 24);
    i0.ɵɵelement(4, "div", 25);
    i0.ɵɵelementStart(5, "div", 13)(6, "div", 26);
    i0.ɵɵelement(7, "i", 27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div")(9, "p", 16);
    i0.ɵɵtext(10, "C\u00E0i \u0111\u1EB7t \u1EE8ng d\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p", 17);
    i0.ɵɵtemplate(12, PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_2_Conditional_12_Template, 8, 0)(13, PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_2_Conditional_13_Template, 11, 0);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(6);
    i0.ɵɵclassProp("bg-green-50", ctx_r1.osType() === "android")("text-green-500", ctx_r1.osType() === "android")("bg-blue-50", ctx_r1.osType() !== "android")("text-blue-500", ctx_r1.osType() !== "android");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("fa-chrome", ctx_r1.osType() === "android" || ctx_r1.osType() === "ios_chrome")("fa-safari", ctx_r1.osType() === "ios_safari_ipad");
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.osType() === "ios_safari_ipad" ? 12 : 13);
} }
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " T\u1EEB b\u1EA3n macOS Sonoma, b\u1EA1n c\u00F3 th\u1EC3 c\u00E0i app b\u1EB1ng c\u00E1ch ch\u1ECDn ");
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2, "T\u1EC7p (File) > Th\u00EAm v\u00E0o Dock");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " tr\u00EAn menu c\u1EE7a Safari. ");
} }
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0, " Nh\u1EA5n bi\u1EC3u t\u01B0\u1EE3ng m\u00E0n h\u00ECnh/t\u1EA3i xu\u1ED1ng \u1EDF g\u00F3c thanh \u0111\u1ECBa ch\u1EC9 tr\u00ECnh duy\u1EC7t, ho\u1EB7c m\u1EDF ");
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2, "Menu > C\u00E0i \u0111\u1EB7t \u1EE9ng d\u1EE5ng");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " \u0111\u1EC3 t\u1EA3i LIMS v\u00E0o m\u00E1y t\u00EDnh. ");
} }
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 29);
    i0.ɵɵlistener("click", function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Template_div_click_0_listener($event) { i0.ɵɵrestoreView(_r6); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵelementStart(1, "div", 30)(2, "div", 31)(3, "div", 32);
    i0.ɵɵelement(4, "i", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div")(6, "h4", 34);
    i0.ɵɵtext(7, "C\u00E0i \u0110\u1EB7t tr\u00EAn M\u00E1y T\u00EDnh");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p", 35);
    i0.ɵɵtemplate(9, PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Conditional_9_Template, 4, 0)(10, PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Conditional_10_Template, 4, 0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "button", 36);
    i0.ɵɵlistener("click", function PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Template_button_click_11_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.closeTooltip()); });
    i0.ɵɵtext(12, "\u0110\u00E3 Hi\u1EC3u");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(9);
    i0.ɵɵconditional(ctx_r1.osType() === "mac_safari" ? 9 : 10);
} }
function PwaInstallPromptComponent_Conditional_0_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵlistener("click", function PwaInstallPromptComponent_Conditional_0_Conditional_4_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeTooltip()); });
    i0.ɵɵtemplate(1, PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_1_Template, 20, 0, "div", 5)(2, PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_2_Template, 14, 13, "div", 6)(3, PwaInstallPromptComponent_Conditional_0_Conditional_4_Conditional_3_Template, 13, 1, "div", 7);
    i0.ɵɵelementStart(4, "button", 8);
    i0.ɵɵlistener("click", function PwaInstallPromptComponent_Conditional_0_Conditional_4_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.closeTooltip()); });
    i0.ɵɵelement(5, "i", 9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.osType() === "ios_safari_phone" ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.osType() === "ios_safari_ipad" || ctx_r1.osType() === "ios_chrome" || ctx_r1.osType() === "android" ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.osType() === "mac_safari" || ctx_r1.osType() === "pc_other" ? 3 : -1);
} }
function PwaInstallPromptComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 0)(1, "button", 1);
    i0.ɵɵlistener("click", function PwaInstallPromptComponent_Conditional_0_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.triggerInstall()); });
    i0.ɵɵelement(2, "i", 2);
    i0.ɵɵtext(3, " H\u01B0\u1EDBng D\u1EABn C\u00E0i \u0110\u1EB7t \u1EE8ng D\u1EE5ng ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(4, PwaInstallPromptComponent_Conditional_0_Conditional_4_Template, 6, 3, "div", 3);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵconditional(ctx_r1.showTooltip() ? 4 : -1);
} }
export class PwaInstallPromptComponent {
    constructor() {
        this.osType = signal(null);
        this.showTooltip = signal(false);
        this.isStandalone = signal(false);
    }
    ngOnInit() {
        this.checkStandaloneMode();
        this.checkDeviceOS();
    }
    // Lắng nghe sự kiện cài đặt gốc của Chrome/Android/Desktop
    onBeforeInstallPrompt(e) {
        e.preventDefault();
        this.deferredPrompt = e;
    }
    checkStandaloneMode() {
        // Nếu người dùng đang mở trang từ PWA App thì ẩn nút đi
        const isPwa = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        this.isStandalone.set(isPwa);
    }
    checkDeviceOS() {
        const ua = window.navigator.userAgent.toLowerCase();
        // 1. Apple Devices
        if (/iphone|ipod/.test(ua)) {
            if (/crios|fxios/.test(ua)) {
                this.osType.set('ios_chrome'); // Chrome/Firefox on iPhone -> Top right
            }
            else {
                this.osType.set('ios_safari_phone'); // Safari on iPhone -> Bottom center
            }
        }
        else if (/ipad/.test(ua) || (/macintosh/.test(ua) && navigator.maxTouchPoints > 1)) {
            if (/crios|fxios/.test(ua)) {
                this.osType.set('ios_chrome'); // Chrome on iPad
            }
            else {
                this.osType.set('ios_safari_ipad'); // Safari on iPad -> Top right
            }
        }
        else if (/macintosh/.test(ua) && navigator.maxTouchPoints <= 1) {
            if (/chrome|edg/.test(ua)) {
                this.osType.set('pc_other'); // Chrome on Mac -> beforeinstallprompt or address bar
            }
            else {
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
    static { this.ɵfac = function PwaInstallPromptComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PwaInstallPromptComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PwaInstallPromptComponent, selectors: [["app-pwa-install-prompt"]], hostBindings: function PwaInstallPromptComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("beforeinstallprompt", function PwaInstallPromptComponent_beforeinstallprompt_HostBindingHandler($event) { return ctx.onBeforeInstallPrompt($event); }, false, i0.ɵɵresolveWindow);
        } }, decls: 1, vars: 1, consts: [[1, "text-center"], [1, "inline-flex", "items-center", "gap-2", "px-4", "py-2", "bg-white/40", "hover:bg-white/60", "backdrop-blur-md", "rounded-full", "text-fuchsia-600", "font-semibold", "text-[12px]", "transition-colors", "shadow-sm", "border", "border-white/50", 3, "click"], [1, "fa-solid", "fa-mobile-screen-button"], [1, "fixed", "inset-0", "z-[100]", "bg-black/50", "backdrop-blur-sm", "animate-fade-in"], [1, "fixed", "inset-0", "z-[100]", "bg-black/50", "backdrop-blur-sm", "animate-fade-in", 3, "click"], [1, "absolute", "bottom-6", "left-1/2", "-translate-x-1/2", "flex", "flex-col", "items-center"], [1, "absolute", "top-4", "right-4", "flex", "flex-col", "items-end"], [1, "fixed", "inset-0", "flex", "items-center", "justify-center", "pointer-events-none"], [1, "absolute", "top-8", "right-8", "w-10", "h-10", "rounded-full", "bg-white/20", "text-white", "flex", "items-center", "justify-center", "backdrop-blur-md", "hover:bg-white/30", "transition-colors", 3, "click"], [1, "fa-solid", "fa-xmark", "text-xl"], [1, "absolute", "bottom-6", "left-1/2", "-translate-x-1/2", "flex", "flex-col", "items-center", 3, "click"], [1, "bg-white", "px-5", "py-4", "rounded-2xl", "shadow-2xl", "relative", "mb-4", "max-w-[280px]"], [1, "absolute", "-bottom-2", "left-1/2", "-translate-x-1/2", "w-0", "h-0", "border-l-[8px]", "border-l-transparent", "border-r-[8px]", "border-r-transparent", "border-t-[8px]", "border-t-white"], [1, "flex", "items-start", "gap-3"], [1, "w-8", "h-8", "rounded-full", "bg-blue-50", "text-blue-500", "flex", "items-center", "justify-center", "flex-shrink-0", "mt-0.5"], [1, "fa-brands", "fa-safari"], [1, "text-[13px]", "font-bold", "text-gray-700", "mb-1"], [1, "text-[12px]", "text-gray-500", "leading-relaxed"], [1, "fa-solid", "fa-arrow-up-from-bracket", "mx-1", "text-blue-500"], [1, "text-white", "text-3xl", "animate-bounce", "drop-shadow-md"], [1, "fa-solid", "fa-arrow-down"], [1, "absolute", "top-4", "right-4", "flex", "flex-col", "items-end", 3, "click"], [1, "text-white", "text-3xl", "animate-bounce", "drop-shadow-md", "mb-2", "mr-2"], [1, "fa-solid", "fa-arrow-up"], [1, "bg-white", "px-5", "py-4", "rounded-2xl", "shadow-2xl", "relative", "max-w-[280px]"], [1, "absolute", "-top-2", "right-4", "w-0", "h-0", "border-l-[8px]", "border-l-transparent", "border-r-[8px]", "border-r-transparent", "border-b-[8px]", "border-b-white"], [1, "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center", "flex-shrink-0", "mt-0.5"], [1, "fa-brands"], [1, "fa-solid", "fa-ellipsis-vertical", "mx-1", "text-gray-600"], [1, "fixed", "inset-0", "flex", "items-center", "justify-center", "pointer-events-none", 3, "click"], [1, "bg-white", "px-6", "py-5", "rounded-3xl", "shadow-2xl", "max-w-[320px]", "pointer-events-auto", "border", "border-gray-100"], [1, "flex", "items-start", "gap-4"], [1, "w-12", "h-12", "rounded-full", "bg-fuchsia-50", "text-fuchsia-500", "flex", "items-center", "justify-center", "flex-shrink-0", "mt-1"], [1, "fa-solid", "fa-display", "text-xl"], [1, "font-bold", "text-gray-700", "text-[15px]", "mb-2"], [1, "text-[13px]", "text-gray-500", "leading-relaxed"], [1, "w-full", "mt-5", "py-2.5", "bg-gray-100", "hover:bg-gray-200", "text-gray-700", "font-bold", "rounded-xl", "transition-colors", "text-[13px]", 3, "click"]], template: function PwaInstallPromptComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, PwaInstallPromptComponent_Conditional_0_Template, 5, 1);
        } if (rf & 2) {
            i0.ɵɵconditional(!ctx.isStandalone() ? 0 : -1);
        } }, dependencies: [CommonModule], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PwaInstallPromptComponent, [{
        type: Component,
        args: [{ selector: 'app-pwa-install-prompt', standalone: true, imports: [CommonModule], template: `
    @if (!isStandalone()) {
      <!-- Nút Cài đặt PWA -->
      <div class="text-center">
          <button (click)="triggerInstall()" class="inline-flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full text-fuchsia-600 font-semibold text-[12px] transition-colors shadow-sm border border-white/50">
              <i class="fa-solid fa-mobile-screen-button"></i> Hướng Dẫn Cài Đặt Ứng Dụng
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
                                  <h4 class="font-bold text-gray-700 text-[15px] mb-2">Cài Đặt trên Máy Tính</h4>
                                  <p class="text-[13px] text-gray-500 leading-relaxed">
                                      @if (osType() === 'mac_safari') {
                                        Từ bản macOS Sonoma, bạn có thể cài app bằng cách chọn <strong>Tệp (File) > Thêm vào Dock</strong> trên menu của Safari.
                                      } @else {
                                        Nhấn biểu tượng màn hình/tải xuống ở góc thanh địa chỉ trình duyệt, hoặc mở <strong>Menu > Cài đặt ứng dụng</strong> để tải LIMS vào máy tính.
                                      }
                                  </p>
                              </div>
                          </div>
                          <button (click)="closeTooltip()" class="w-full mt-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-[13px]">Đã Hiểu</button>
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
  ` }]
    }], null, { onBeforeInstallPrompt: [{
            type: HostListener,
            args: ['window:beforeinstallprompt', ['$event']]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PwaInstallPromptComponent, { className: "PwaInstallPromptComponent", filePath: "src/app/shared/components/pwa-install-prompt.component.ts", lineNumber: 115 }); })();
//# sourceMappingURL=pwa-install-prompt.component.js.map