import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { SUBJECTS } from '../../../../shared/domain/model/subject';
import { BoardStore } from '../../../application/board.store';
import { Note } from '../../../domain/model/note.entity';
import { SaveNoteCommand } from '../../../domain/model/save-note.command';

export interface NoteDialogData {
  note?: Note;
}

/** Create/edit form for a board note. Builds a SaveNoteCommand for the store. */
@Component({
  selector: 'app-note-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe,
  ],
  templateUrl: './note-form-dialog.html',
  styleUrl: './note-form-dialog.css',
})
export class NoteFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<NoteFormDialog>);
  private readonly store = inject(BoardStore);
  readonly data: NoteDialogData = inject(MAT_DIALOG_DATA) ?? {};

  readonly subjects = SUBJECTS;
  readonly isEdit = !!this.data.note;
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: [this.data.note?.title ?? '', [Validators.required, Validators.maxLength(80)]],
    subject: [this.data.note?.subject ?? 'math', Validators.required],
    imageUrl: [this.data.note?.imageUrl ?? '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    dayLabel: [this.data.note?.dayLabel ?? '', Validators.required],
  });

  get previewUrl(): string { return this.form.controls.imageUrl.value; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const command = new SaveNoteCommand({
      id: this.data.note?.id,
      title: v.title,
      subject: v.subject,
      imageUrl: v.imageUrl,
      dayLabel: v.dayLabel,
    });
    this.loading.set(true);
    this.errorMsg.set(null);
    this.store.saveNote$(command).subscribe({
      next: (saved) => { this.loading.set(false); this.ref.close(saved); },
      error: (err) => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Error al guardar'); },
    });
  }

  cancel(): void { this.ref.close(); }
}
