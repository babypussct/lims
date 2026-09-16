import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NAFIQPM6 LIMS — logo thương hiệu dùng bên trong giao diện.
 *
 * App icon PWA/iOS được giữ riêng trong public/icons vì các icon đó có nền/safe area
 * dành cho launcher. UI dùng brand mark có alpha thật để không lộ ô app icon.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'inline-flex items-center justify-center shrink-0',
    '[style.width]': 'size',
    '[style.height]': 'size'
  },
  template: `
    <img
      src="brand/logo-mark-512.png"
      class="w-full h-full object-contain select-none pointer-events-none block shrink-0"
      alt="LIMS NAFIQPM6 Logo"
    />
  `
})
export class LogoComponent {
  /** Kích thước hiển thị (ví dụ: '18px', '32px', '64px', '128px') */
  @Input() size = '32px';
  /** Chế độ màu (để tương thích ngược với các file HTML cũ, không ảnh hưởng đến PNG) */
  @Input() mode: 'currentColor' | 'multicolor' = 'multicolor';
}
