import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface SectionLink {
  icon: string;
  path: string;
  titleKey: string;
  descKey: string;
  color: string;
}

/** Landing dashboard: an entry point into each bounded context. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly sections: SectionLink[] = [
    { icon: 'space_dashboard', path: '/tablero', titleKey: 'option.board', descKey: 'home.card.board', color: 'var(--subject-math)' },
    { icon: 'calendar_month', path: '/calendario', titleKey: 'option.calendar', descKey: 'home.card.calendar', color: 'var(--subject-physics)' },
    { icon: 'quiz', path: '/examenes', titleKey: 'option.assessment', descKey: 'home.card.assessment', color: 'var(--subject-lang)' },
    { icon: 'menu_book', path: '/cuaderno', titleKey: 'option.notebook', descKey: 'home.card.notebook', color: 'var(--subject-cs)' },
  ];
}
