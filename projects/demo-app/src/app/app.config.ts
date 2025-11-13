import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideDatepickerConfig } from 'ngxsmk-datepicker';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Global datepicker configuration - applies to all datepicker instances
    provideDatepickerConfig({
      weekStart: 1, // Monday as first day of week
      minuteInterval: 15, // 15-minute intervals for time selection
      yearRange: 20, // Show 20 years before and after current year
      // holidayProvider: null, // Can be set globally here
      // locale: 'en-US', // Can be set globally here
    })
  ]
};
