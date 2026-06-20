import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

/**
 * Root providers. No auth/IAM interceptor by design — the app talks to a plain
 * json-server REST API with no protected resources. Translations are loaded as
 * JSON files from ./i18n/{lang}.json.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideTranslateService({
      fallbackLang: 'es',
      lang: 'es',
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
    }),
  ],
};
