import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // Zone.js is optional in Angular 21. The datepicker works with or without zone.js
  // thanks to OnPush change detection and manual markForCheck() calls.
  // Uncomment the line below to enable zone.js (optional):
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }), // Optional: enable zone.js
    provideRouter(routes)
  ]
};
