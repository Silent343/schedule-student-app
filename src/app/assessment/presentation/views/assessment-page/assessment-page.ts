import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog';
import { AssessmentStore } from '../../../application/assessment.store';
import { Quiz } from '../../../domain/model/quiz.entity';
import { QuizCard } from '../../components/quiz-card/quiz-card';
import { QuizDialogData, QuizFormDialog } from '../../components/quiz-form-dialog/quiz-form-dialog';
import { QuizRunner, QuizRunnerData } from '../../components/quiz-runner/quiz-runner';

/** "Exámenes" — quiz library + practice runner. Composition root for assessment. */
@Component({
  selector: 'app-assessment-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, QuizCard, TranslatePipe],
  templateUrl: './assessment-page.html',
  styleUrl: './assessment-page.css',
})
export class AssessmentPage implements OnInit {
  private readonly store = inject(AssessmentStore);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  readonly quizzes = this.store.quizzes;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly total = this.store.total;
  readonly questionTotal = this.store.questionTotal;

  ngOnInit(): void { this.store.loadQuizzes(); }

  start(quiz: Quiz): void {
    this.dialog.open(QuizRunner, {
      panelClass: 'aula-dialog', maxWidth: '95vw', autoFocus: false,
      data: { quiz } as QuizRunnerData,
    });
  }

  openCreate(): void { this.dialog.open(QuizFormDialog, this.cfg({})); }
  openEdit(quiz: Quiz): void { this.dialog.open(QuizFormDialog, this.cfg({ quiz })); }

  remove(quiz: Quiz): void {
    const data: ConfirmDialogData = {
      title: this.translate.instant('assessment.delete.title'),
      message: this.translate.instant('assessment.delete.message', { title: quiz.title }),
      confirmLabel: this.translate.instant('common.delete'),
      cancelLabel: this.translate.instant('common.cancel'),
    };
    this.dialog.open(ConfirmDialog, { panelClass: 'aula-dialog', data, autoFocus: false })
      .afterClosed().subscribe((ok) => ok && this.store.deleteQuiz(quiz.id));
  }

  private cfg(data: QuizDialogData) {
    return { panelClass: 'aula-dialog', maxWidth: '95vw', autoFocus: false, data };
  }
}
