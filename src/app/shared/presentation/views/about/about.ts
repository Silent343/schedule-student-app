import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ContextInfo {
  icon: string;
  titleKey: string;
  descKey: string;
}

/** Static page describing the app and its architecture, in plain language. */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  readonly contexts: ContextInfo[] = [
    { icon: 'space_dashboard', titleKey: 'option.board', descKey: 'about.ctx.board' },
    { icon: 'calendar_month', titleKey: 'option.calendar', descKey: 'about.ctx.calendar' },
    { icon: 'quiz', titleKey: 'option.assessment', descKey: 'about.ctx.assessment' },
    { icon: 'menu_book', titleKey: 'option.notebook', descKey: 'about.ctx.notebook' },
  ];

  readonly layers: string[] = ['about.layer.domain', 'about.layer.application', 'about.layer.infrastructure', 'about.layer.presentation'];
}
