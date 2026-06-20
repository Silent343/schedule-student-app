import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { UpperCasePipe } from '@angular/common';

/** Toggles the UI language between Spanish and English, persisting the choice. */
@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, UpperCasePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  private readonly translate = inject(TranslateService);
  readonly current = signal<string>(this.translate.currentLang ?? 'es');

  use(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('aula.lang', lang);
    this.current.set(lang);
  }
}
