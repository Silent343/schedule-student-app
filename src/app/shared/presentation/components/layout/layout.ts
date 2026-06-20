import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { FooterContent } from '../footer-content/footer-content';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface MenuOption {
  icon: string;
  path: string;
  titleKey: string;
}

/**
 * Application shell: collapsible sidebar + top bar wrapping the routed views.
 * Owns navigation chrome only; every page is rendered through <router-outlet>.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule,
    MatSidenavModule, LanguageSwitcher, FooterContent, TranslatePipe,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  @ViewChild(MatSidenav) sidenav?: MatSidenav;

  private readonly observer = inject(BreakpointObserver);
  private readonly router = inject(Router);

  readonly isCollapsed = signal(false);
  readonly activeTitle = signal('option.board');

  readonly options: MenuOption[] = [
    { icon: 'space_dashboard', path: '/tablero', titleKey: 'option.board' },
    { icon: 'calendar_month', path: '/calendario', titleKey: 'option.calendar' },
    { icon: 'quiz', path: '/examenes', titleKey: 'option.assessment' },
    { icon: 'menu_book', path: '/cuaderno', titleKey: 'option.notebook' },
  ];

  readonly secondary: MenuOption[] = [
    { icon: 'info', path: '/acerca', titleKey: 'option.about' },
  ];

  readonly headerTitle = computed(() => this.activeTitle());

  ngOnInit(): void {
    this.syncActive(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.syncActive(e.urlAfterRedirects));
  }

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 1024px)']).subscribe((res) => {
      if (!this.sidenav) return;
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.isCollapsed.set(false);
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  toggleMenu(): void {
    if (this.sidenav?.mode === 'over') {
      this.sidenav.toggle();
    } else {
      this.isCollapsed.update((v) => !v);
    }
  }

  closeOnMobile(): void {
    if (this.sidenav?.mode === 'over') this.sidenav.close();
  }

  private syncActive(url: string): void {
    const path = url.split('?')[0];
    const match = [...this.options, ...this.secondary].find((o) => path.startsWith(o.path));
    this.activeTitle.set(match?.titleKey ?? 'option.board');
  }
}
