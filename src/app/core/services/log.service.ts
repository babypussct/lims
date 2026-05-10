import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * LogService — Tập trung toàn bộ logging, có thể tắt hoàn toàn trong production.
 * 
 * Sử dụng: inject(LogService) thay vì console.log trực tiếp.
 * - log(): Chỉ in trong development (environment.production = false)
 * - warn(): Luôn in (lỗi non-critical cần chú ý)
 * - error(): Luôn in (lỗi cần xử lý)
 */
@Injectable({ providedIn: 'root' })
export class LogService {
  private readonly isProd = environment.production;

  /**
   * Log thông tin debug — Im lặng trong production
   */
  log(tag: string, message: string, data?: unknown): void {
    if (this.isProd) return;
    if (data !== undefined) {
      console.log(`[${tag}] ${message}`, data);
    } else {
      console.log(`[${tag}] ${message}`);
    }
  }

  /**
   * Log cảnh báo — Luôn hiển thị, ngay cả trong production
   */
  warn(tag: string, message: string, data?: unknown): void {
    if (data !== undefined) {
      console.warn(`[${tag}] ${message}`, data);
    } else {
      console.warn(`[${tag}] ${message}`);
    }
  }

  /**
   * Log lỗi — Luôn hiển thị, ngay cả trong production
   */
  error(tag: string, message: string, data?: unknown): void {
    if (data !== undefined) {
      console.error(`[${tag}] ${message}`, data);
    } else {
      console.error(`[${tag}] ${message}`);
    }
  }
}
