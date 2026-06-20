import { Routes } from '@angular/router';

const assessmentPage = () =>
  import('./views/assessment-page/assessment-page').then((m) => m.AssessmentPage);

/** Route tree for the assessment (Exámenes) bounded context. */
export const assessmentRoutes: Routes = [
  { path: '', loadComponent: assessmentPage, title: 'Aula — Exámenes' },
];
