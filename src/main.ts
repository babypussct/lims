
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js'; // Bắt buộc phải có khi sử dụng provideZoneChangeDetection
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
