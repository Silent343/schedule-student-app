import { Routes } from '@angular/router';

/**
 * Top-level route table. Each feature path lazy-loads its bounded-context route
 * tree; the Layout shell is provided by the root component, so these render into
 * its <router-outlet>.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/presentation/views/home/home').then((m) => m.Home),
    title: 'Aula — Inicio',
  },
  {
    path: 'tablero',
    loadChildren: () =>
      import('./board/presentation/board.routes').then((m) => m.boardRoutes),
  },
  {
    path: 'calendario',
    loadChildren: () =>
      import('./scheduling/presentation/scheduling.routes').then((m) => m.schedulingRoutes),
  },
  {
    path: 'examenes',
    loadChildren: () =>
      import('./assessment/presentation/assessment.routes').then((m) => m.assessmentRoutes),
  },
  {
    path: 'cuaderno',
    loadChildren: () =>
      import('./notebook/presentation/notebook.routes').then((m) => m.notebookRoutes),
  },
  {
    path: 'acerca',
    loadComponent: () =>
      import('./shared/presentation/views/about/about').then((m) => m.About),
    title: 'Aula — Acerca de',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound),
    title: 'Aula — 404',
  },
];
