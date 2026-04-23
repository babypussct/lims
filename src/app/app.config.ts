import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withHashLocation, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

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
    ), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerImmediately'
          })
  ]
};