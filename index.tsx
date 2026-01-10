

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app/app.component';
import { appConfig } from './src/app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
