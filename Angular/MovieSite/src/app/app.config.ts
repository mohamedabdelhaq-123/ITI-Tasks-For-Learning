import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // ← Add this import

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), 
       provideHttpClient() ] 
};
// Tells Angular: "Make HttpClient available throughout the entire app!"
// Now ANY service can use HttpClient via dependency injection.