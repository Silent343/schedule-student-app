import { UpperCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { OptionKey } from '../../../domain/model/option-key';
import { AttemptResult, QuizAttempt } from '../../../domain/model/quiz-attempt';
import { Quiz } from '../../../domain/model/quiz.entity';
import { QuizQuestion } from '../../../domain/model/quiz-question';
import { subjectStyle } from '../../../../shared/presentation/util/subject-style';

export interface QuizRunnerData {
  quiz: Quiz;
}

/**
 * Interactive quiz player. Walks the question set, collects answers and defers
 * grading entirely to the {@link QuizAttempt} domain service.
 */
@Component({
  selector: 'app-quiz-runner',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe, UpperCasePipe],
  templateUrl: './quiz-runner.html',
  styleUrl: './quiz-runner.css',
})
export class QuizRunner {
  private readonly ref = inject(MatDialogRef<QuizRunner>);
  readonly data: QuizRunnerData = inject(MAT_DIALOG_DATA);

  protected readonly style = subjectStyle;

  readonly quiz = this.data.quiz;
  readonly index = signal(0);
  readonly answers = signal<Map<string, OptionKey | null>>(new Map());
  readonly result = signal<AttemptResult | null>(null);

  get current(): QuizQuestion { return this.quiz.questions[this.index()]; }
  get isLast(): boolean { return this.index() === this.quiz.questions.length - 1; }
  get chosen(): OptionKey | null { return this.answers().get(this.current.id) ?? null; }

  progressPercent(): number {
    return Math.round(((this.index() + 1) / this.quiz.questions.length) * 100);
  }

  choose(key: OptionKey): void {
    const next = new Map(this.answers());
    next.set(this.current.id, key);
    this.answers.set(next);
  }

  prev(): void { if (this.index() > 0) this.index.update((i) => i - 1); }

  next(): void {
    if (this.isLast) { this.finish(); return; }
    this.index.update((i) => i + 1);
  }

  finish(): void {
    const attempt = new QuizAttempt(this.quiz);
    this.result.set(attempt.evaluate(this.answers()));
  }

  retry(): void {
    this.answers.set(new Map());
    this.index.set(0);
    this.result.set(null);
  }

  close(): void { this.ref.close(); }

  scoreTone(): 'great' | 'ok' | 'low' {
    const p = this.result()?.scorePercent ?? 0;
    return p >= 80 ? 'great' : p >= 50 ? 'ok' : 'low';
  }
}
