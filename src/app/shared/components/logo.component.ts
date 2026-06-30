import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * NAFIQPM6 LIMS — Logo Component (Sử dụng trực tiếp tệp tin ảnh tĩnh chuẩn từ public/icons)
 *
 * Để đạt được độ đồng bộ 100% tuyệt đối y hệt như bản phác thảo hình ảnh gốc đã phê duyệt
 * (không lệch một pixel nào và giữ nguyên hiệu ứng phát sáng 3D phức tạp):
 * Chúng ta sử dụng trực tiếp các tệp tin PNG được tối ưu hóa theo kích thước tương ứng.
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
      [src]="getIconPath()"
      class="w-full h-full object-contain select-none pointer-events-none block shrink-0"
      alt="LIMS NAFIQPM6 Logo"
    />
  `
})
export class LogoComponent {
  /** Kích thước hiển thị (ví dụ: '18px', '32px', '64px', '128px') */
  @Input() size: string = '32px';
  /** Chế độ màu (để tương thích ngược với các file HTML cũ, không ảnh hưởng đến PNG) */
  @Input() mode: 'currentColor' | 'multicolor' = 'multicolor';

  getIconPath(): string {
    const numericSize = parseInt(this.size, 10) || 32;

    if (numericSize <= 24) {
      return 'icons/icon-72x72.png';
    } else if (numericSize <= 48) {
      return 'icons/icon-96x96.png';
    } else if (numericSize <= 192) {
      return 'icons/icon-192x192.png';
    } else {
      return 'icons/icon-512x512.png';
    }
  }
}
