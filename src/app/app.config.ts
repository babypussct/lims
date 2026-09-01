import { ApplicationConfig, provideZoneChangeDetection, isDevMode, ErrorHandler, Injectable } from '@angular/core';
import {
  provideRouter,
  withHashLocation,
  withComponentInputBinding,
  withPreloading,
  withRouterConfig
} from '@angular/router';
import { routes } from './app.routes';
import { AdaptivePreloadingStrategy } from './core/routing/adaptive-preloading.strategy';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';
import { claimChunkRecoveryReload } from './core/utils/chunk-reload-recovery';

/**
 * Global Error Handler: Tự động reload khi gặp lỗi "stale chunk" sau deploy mới.
 * 
 * Khi Vercel deploy bản build mới, tên chunk JS thay đổi (hash khác).
 * User đang dùng bản cũ → trình duyệt cố load chunk cũ → lỗi.
 * Handler này phát hiện và tự động reload 1 lần duy nhất.
 */
@Injectable()
class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const message = error?.message || error?.toString() || '';
    
    // Detect chunk loading failures (stale deploy)
    const isChunkError = 
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Loading chunk') ||
      message.includes('ChunkLoadError');

    if (isChunkError) {
      // Chỉ auto-reload 1 lần mỗi 30 giây để tránh loop vô hạn. Nếu storage
      // không khả dụng, helper fail-closed để không biến stale chunk thành reload loop.
      if (claimChunkRecoveryReload(sessionStorage, Date.now())) {
        console.warn('[LIMS] Phát hiện chunk cũ sau deploy mới. Đang tải lại...');
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
      withPreloading(AdaptivePreloadingStrategy),
      // Tối ưu hoá Navigation Stack nếu người dùng huỷ chuyển trang (cancel loading module)
      withRouterConfig({ canceledNavigationResolution: 'replace' })
    ), 
    provideServiceWorker('firebase-messaging-sw.js', {
      enabled: !isDevMode(),
      // Do not make service-worker installation compete with the first render
      // on older phones and low-spec PCs. The timeout is a safety net for apps
      // that keep a long-running async task alive.
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideHttpClient(),
    // Global chunk error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
