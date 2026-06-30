import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NAFIQPM6 LIMS — Logo Component (Mẫu 1 gốc: Symmetrical Shield + Leaping Fish)
 *
 * Biểu tượng logo tích hợp GC-MS/MS & Nhiệm vụ NAFIQPM6:
 * - Khiên bảo hộ an toàn thực phẩm (Shield)
 * - 3 vòng cột sắc ký GC đồng tâm ở nền (Capillary Column)
 * - 4 cực tứ cực MS/MS đối xứng (Quadrupole Rods Cross-section)
 * - Chú cá thủy sản nhảy cao lồng ghép vào đường peak sắc ký (Fisheries + Chromatogram)
 * - Đường sắc ký đồ 3 đỉnh peak dưới đáy (Base Chromatogram)
 *
 * Hỗ trợ 2 chế độ hiển thị:
 * 1. `multicolor` (Mặc định): Sử dụng phối màu neon phát sáng cực đẹp (Cyan cho khiên/GC, Tím cho tứ cực, Hồng cho cá/peak sắc ký).
 * 2. `currentColor`: Đơn sắc, tự động thừa hưởng màu chữ từ component cha (ví dụ `text-white`, `text-indigo-600`).
 *
 * @example
 *   <app-logo size="64px" mode="multicolor"></app-logo>
 *   <app-logo size="18px" mode="currentColor" class="text-white"></app-logo>
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [ngStyle]="{ display: 'block', flexShrink: '0' }"
      aria-label="LIMS NAFIQPM6 Logo"
      role="img">

      <defs>
        <!-- Gradients dùng cho chế độ hiển thị đa màu sắc (multicolor) -->
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" /> <!-- Xanh dương điện tử -->
          <stop offset="100%" stop-color="#06b6d4" /> <!-- Xanh neon Cyan -->
        </linearGradient>
        <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f43f5e" /> <!-- Hồng Rose -->
          <stop offset="100%" stop-color="#ec4899" /> <!-- Hồng cánh sen Neon -->
        </linearGradient>
      </defs>

      <!-- ── 1. SHIELD: Khiên bảo hộ an toàn chất lượng ── -->
      <path
        d="M16 2.5c6 0 9.5 2.2 9.5 8.5 0 7-6 13-9.5 15.8C12.5 24 6.5 18 6.5 11c0-6.3 3.5-8.5 9.5-8.5z"
        [attr.stroke]="mode === 'multicolor' ? 'url(#shieldGrad)' : 'currentColor'"
        stroke-width="1.8"
        stroke-linejoin="round"
        stroke-linecap="round" />

      <!-- ── 2. GC COLUMN: Vòng cột sắc ký mao quản đồng tâm ── -->
      <circle cx="16" cy="13" r="7.5" [attr.stroke]="mode === 'multicolor' ? '#06b6d4' : 'currentColor'" stroke-width="0.9" [attr.stroke-opacity]="mode === 'multicolor' ? 0.25 : 0.15" />
      <circle cx="16" cy="13" r="5.2" [attr.stroke]="mode === 'multicolor' ? '#06b6d4' : 'currentColor'" stroke-width="0.9" [attr.stroke-opacity]="mode === 'multicolor' ? 0.45 : 0.30" />
      <circle cx="16" cy="13" r="3"   [attr.stroke]="mode === 'multicolor' ? '#06b6d4' : 'currentColor'" stroke-width="0.9" [attr.stroke-opacity]="mode === 'multicolor' ? 0.70 : 0.50" />

      <!-- ── 3. MS/MS QUADRUPOLE: Mặt cắt ngang 4 cực điện cực ── -->
      <circle cx="16"   cy="7"    r="1.2" [attr.fill]="mode === 'multicolor' ? '#a855f7' : 'currentColor'" [attr.fill-opacity]="mode === 'multicolor' ? 0.85 : 0.55" />
      <circle cx="16"   cy="19"   r="1.2" [attr.fill]="mode === 'multicolor' ? '#a855f7' : 'currentColor'" [attr.fill-opacity]="mode === 'multicolor' ? 0.85 : 0.55" />
      <circle cx="10.2" cy="13"   r="1.2" [attr.fill]="mode === 'multicolor' ? '#a855f7' : 'currentColor'" [attr.fill-opacity]="mode === 'multicolor' ? 0.85 : 0.55" />
      <circle cx="21.8" cy="13"   r="1.2" [attr.fill]="mode === 'multicolor' ? '#a855f7' : 'currentColor'" [attr.fill-opacity]="mode === 'multicolor' ? 0.85 : 0.55" />

      <!-- ── 4. FISH: Cá thủy sản nhảy cao cách điệu ── -->
      <!-- Thân cá — cong theo đường sắc ký đồ Gaussian -->
      <path
        d="M10.5 17.5 C12 14.5 14 12.5 16.5 12.5 C18.5 12.5 19.8 13.8 20 15.2 C18.5 15 17 14.6 15.5 14.8 C13.5 15.1 11.8 16.5 10.5 17.5Z"
        [attr.fill]="mode === 'multicolor' ? 'url(#fishGrad)' : 'currentColor'" />
      <!-- Đuôi cá cách điệu -->
      <path
        d="M10.5 17.5 L8.5 15.8 L9 17.5 L8.5 19.2 Z"
        [attr.fill]="mode === 'multicolor' ? 'url(#fishGrad)' : 'currentColor'" />
      <!-- Vây lưng nhỏ -->
      <path
        d="M14 13.5 C14.5 12 15.5 11.5 16.5 12.5"
        [attr.stroke]="mode === 'multicolor' ? '#f43f5e' : 'currentColor'" stroke-width="0.8" stroke-linecap="round" />
      <!-- Mắt cá -->
      <circle cx="19.2" cy="14.2" r="0.45" [attr.fill]="mode === 'multicolor' ? '#f43f5e' : 'currentColor'" [attr.fill-opacity]="mode === 'multicolor' ? 0.3 : 0.2" />
      <circle cx="19.2" cy="14.2" r="0.22" [attr.fill]="mode === 'multicolor' ? '#ffffff' : 'currentColor'" />

      <!-- ── 5. CHROMATOGRAM: Sắc ký đồ 3 đỉnh peak tại đáy khiên ── -->
      <path
        d="M8.5 22.5
           C9.5 22.5 10 19 10.8 19
           S11.6 22.5 12.5 22.5
           C13 22.5 13.5 17 14.8 15.5
           C15.5 14.5 16 17 16.5 22.5
           C17 22.5 17.5 20.5 18.2 20.5
           S19 22.5 20 22.5
           H22.5"
        [attr.stroke]="mode === 'multicolor' ? '#f43f5e' : 'currentColor'"
        stroke-width="1.8"
        stroke-linejoin="round"
        stroke-linecap="round" />

    </svg>
  `
})
export class LogoComponent {
  /** Chiều rộng và chiều cao của logo (vuông) */
  @Input() size: string = '32px';
  /** Chế độ màu: 'multicolor' (phát sáng neon đa sắc) hoặc 'currentColor' (đơn sắc kế thừa từ cha) */
  @Input() mode: 'currentColor' | 'multicolor' = 'multicolor';
}
