import { Routes } from '@angular/router';

const notebookPage = () =>
  import('./views/notebook-page/notebook-page').then((m) => m.NotebookPageView);

/** Route tree for the notebook (Cuaderno) bounded context. */
export const notebookRoutes: Routes = [
  { path: '', loadComponent: notebookPage, title: 'Aula — Cuaderno' },
];
