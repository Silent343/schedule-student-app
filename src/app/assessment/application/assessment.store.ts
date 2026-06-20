import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Quiz } from '../domain/model/quiz.entity';
import { SaveQuizCommand } from '../domain/model/save-quiz.command';
import { AssessmentApi } from '../infrastructure/assessment-api';

/** Application service for the assessment context. */
@Injectable({ providedIn: 'root' })
export class AssessmentStore {
  private readonly api = inject(AssessmentApi);

  private readonly quizzesSignal = signal<Quiz[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly quizzes = this.quizzesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly total = computed(() => this.quizzesSignal().length);
  readonly questionTotal = computed(() =>
    this.quizzesSignal().reduce((sum, q) => sum + q.questionCount, 0),
  );

  loadQuizzes(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getQuizzes().subscribe({
      next: (quizzes) => { this.quizzesSignal.set(quizzes); this.loadingSignal.set(false); },
      error: (err) => {
        this.errorSignal.set(err.message ?? 'No se pudieron cargar los exámenes');
        this.loadingSignal.set(false);
      },
    });
  }

  saveQuiz$(command: SaveQuizCommand): Observable<Quiz> {
    return command.id !== undefined ? this.updateQuiz$(command, command.id) : this.createQuiz$(command);
  }

  deleteQuiz(id: number): void {
    this.api.deleteQuiz(id).subscribe({
      next: () => this.quizzesSignal.update((list) => list.filter((q) => q.id !== id)),
      error: (err) => this.errorSignal.set(err.message ?? 'No se pudo eliminar el examen'),
    });
  }

  private createQuiz$(c: SaveQuizCommand): Observable<Quiz> {
    const quiz = new Quiz({ id: 0, title: c.title, subject: c.subject, questions: c.questions });
    return this.api.createQuiz(quiz).pipe(
      tap((created) => this.quizzesSignal.update((list) => [created, ...list])),
    );
  }

  private updateQuiz$(c: SaveQuizCommand, id: number): Observable<Quiz> {
    const quiz = new Quiz({ id, title: c.title, subject: c.subject, questions: c.questions });
    return this.api.updateQuiz(quiz).pipe(
      tap((updated) => this.quizzesSignal.update((list) => list.map((q) => (q.id === updated.id ? updated : q)))),
    );
  }
}
