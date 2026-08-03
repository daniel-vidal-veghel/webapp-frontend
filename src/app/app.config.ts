import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

/* Root application configuration for the standalone bootstrap in main.ts. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations()
  ]
};
