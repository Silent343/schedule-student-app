import { UpperCasePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { SUBJECTS } from '../../../../shared/domain/model/subject';
import { AssessmentStore } from '../../../application/assessment.store';
import { OptionKey, OPTION_KEYS } from '../../../domain/model/option-key';
import { Quiz } from '../../../domain/model/quiz.entity';
import { QuizQuestion } from '../../../domain/model/quiz-question';
import { SaveQuizCommand } from '../../../domain/model/save-quiz.command';

export interface QuizDialogData {
  quiz?: Quiz;
}

/**
 * Create/edit form for a quiz. Questions live in a reactive FormArray so the
 * user can add and remove them; each question carries four option fields plus a
 * correct-answer selector.
 */
@Component({
  selector: 'app-quiz-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, UpperCasePipe,
  ],
  templateUrl: './quiz-form-dialog.html',
  styleUrl: './quiz-form-dialog.css',
})
export class QuizFormDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<QuizFormDialog>);
  private readonly store = inject(AssessmentStore);
  readonly data: QuizDialogData = inject(MAT_DIALOG_DATA) ?? {};

  readonly subjects = SUBJECTS;
  readonly optionKeys = OPTION_KEYS;
  readonly isEdit = !!this.data.quiz;
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: [this.data.quiz?.title ?? '', [Validators.required, Validators.maxLength(80)]],
    subject: [this.data.quiz?.subject ?? 'math', Validators.required],
    questions: this.fb.array(
      (this.data.quiz?.questions ?? []).map((q) => this.questionGroup(q)),
    ),
  });

  get questions(): FormArray {
    return this.form.controls.questions as FormArray;
  }

  ngOnInit(): void {
    if (this.questions.length === 0) this.addQuestion();
  }

  addQuestion(): void {
    this.questions.push(this.questionGroup());
  }

  removeQuestion(i: number): void {
    this.questions.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid || this.questions.length === 0) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();

    const questions: QuizQuestion[] = (raw.questions as Array<{
      prompt: string; a: string; b: string; c: string; d: string; correctKey: OptionKey; explanation: string;
    }>).map((q, idx) => new QuizQuestion({
      id: this.data.quiz?.questions[idx]?.id ?? `q-${Date.now()}-${idx}`,
      prompt: q.prompt,
      options: [
        { key: 'a', label: q.a }, { key: 'b', label: q.b },
        { key: 'c', label: q.c }, { key: 'd', label: q.d },
      ],
      correctKey: q.correctKey,
      explanation: q.explanation,
    }));

    const command = new SaveQuizCommand({
      id: this.data.quiz?.id,
      title: raw.title,
      subject: raw.subject,
      questions,
    });

    this.loading.set(true);
    this.errorMsg.set(null);
    this.store.saveQuiz$(command).subscribe({
      next: (saved) => { this.loading.set(false); this.ref.close(saved); },
      error: (err) => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Error al guardar'); },
    });
  }

  cancel(): void { this.ref.close(); }

  private questionGroup(q?: QuizQuestion): FormGroup {
    const labelOf = (k: OptionKey) => q?.options.find((o) => o.key === k)?.label ?? '';
    return this.fb.nonNullable.group({
      prompt: [q?.prompt ?? '', Validators.required],
      a: [labelOf('a'), Validators.required],
      b: [labelOf('b'), Validators.required],
      c: [labelOf('c'), Validators.required],
      d: [labelOf('d'), Validators.required],
      correctKey: [q?.correctKey ?? 'a', Validators.required],
      explanation: [q?.explanation ?? ''],
    });
  }
}
