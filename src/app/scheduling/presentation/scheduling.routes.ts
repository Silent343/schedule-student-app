import { Routes } from '@angular/router';

const calendarPage = () =>
  import('./views/calendar-page/calendar-page').then((m) => m.CalendarPage);

/** Route tree for the scheduling (Calendario) bounded context. */
export const schedulingRoutes: Routes = [
  { path: '', loadComponent: calendarPage, title: 'Aula — Calendario' },
];
