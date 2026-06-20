import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Layout } from './shared/presentation/components/layout/layout';

/** Root component. Boots i18n and hosts the application shell. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['es', 'en']);
    const saved = localStorage.getItem('aula.lang');
    const browser = this.translate.getBrowserLang();
    const lang = saved ?? (browser === 'en' ? 'en' : 'es');
    this.translate.use(lang);
  }
}
