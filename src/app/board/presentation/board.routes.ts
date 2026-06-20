import { Routes } from '@angular/router';

const boardPage = () =>
  import('./views/board-page/board-page').then((m) => m.BoardPage);

/** Route tree for the board (Tablero) bounded context. */
export const boardRoutes: Routes = [
  { path: '', loadComponent: boardPage, title: 'Aula — Tablero' },
];
