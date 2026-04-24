import { ApplicationConfig, provideZoneChangeDetection, isDevMode, ErrorHandler, Injectable } from '@angular/core';
import { provideRouter, withHashLocation, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

/**
 * Global Error Handler: Tự động reload khi gặp lỗi "stale chunk" sau deploy mới.
 * 
 * Khi Vercel deploy bản build mới, tên chunk JS thay đổi (hash khác).
 * User đang dùng bản cũ → trình duyệt cố load chunk cũ → lỗi.
 * Handler này phát hiện và tự động reload 1 lần duy nhất.
 */
@Injectable()
class GlobalErrorHandler implements ErrorHandler {
  private static readonly RELOAD_KEY = 'lims_chunk_reload';

  handleError(error: any): void {
    const message = error?.message || error?.toString() || '';
    
    // Detect chunk loading failures (stale deploy)
    const isChunkError = 
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Loading chunk') ||
      message.includes('ChunkLoadError');

    if (isChunkError) {
      const lastReload = Number(sessionStorage.getItem(GlobalErrorHandler.RELOAD_KEY) || '0');
      const now = Date.now();
      
      // Chỉ auto-reload 1 lần mỗi 30 giây để tránh loop vô hạn
      if (now - lastReload > 30_000) {
        console.warn('[LIMS] Phát hiện chunk cũ sau deploy mới. Đang tải lại...');
        sessionStorage.setItem(GlobalErrorHandler.RELOAD_KEY, now.toString());
        window.location.reload();
        return;
      }
    }

    // Log tất cả lỗi khác bình thường
    console.error(error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Kích hoạt Zone.js với tính năng gộp sự kiện để tối ưu hiệu năng
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes, 
      withHashLocation(), 
      withComponentInputBinding(),
      // Tối ưu hoá Navigation Stack nếu người dùng huỷ chuyển trang (cancel loading module)
      withRouterConfig({ canceledNavigationResolution: 'replace' })
    ), 
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately'
    }),
    // Global chunk error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};