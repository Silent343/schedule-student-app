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
import { NotebookStore } from '../../../application/notebook.store';
import { Notebook } from '../../../domain/model/notebook.entity';
import { NotebookPage } from '../../../domain/model/notebook-page';
import { SaveNotebookCommand } from '../../../domain/model/save-notebook.command';

export interface NotebookDialogData {
  notebook?: Notebook;
}

const COVER_COLORS = ['#3d4db7', '#2a9d8f', '#c2557a', '#6d5bd0', '#d98324', '#475569'];

/** Create/edit form for a notebook, with a reactive page list. */
@Component({
  selector: 'app-notebook-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe,
  ],
  templateUrl: './notebook-form-dialog.html',
  styleUrl: './notebook-form-dialog.css',
})
export class NotebookFormDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<NotebookFormDialog>);
  private readonly store = inject(NotebookStore);
  readonly data: NotebookDialogData = inject(MAT_DIALOG_DATA) ?? {};

  readonly subjects = SUBJECTS;
  readonly covers = COVER_COLORS;
  readonly isEdit = !!this.data.notebook;
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: [this.data.notebook?.title ?? '', [Validators.required, Validators.maxLength(80)]],
    subject: [this.data.notebook?.subject ?? 'math', Validators.required],
    coverColor: [this.data.notebook?.coverColor ?? COVER_COLORS[0], Validators.required],
    pages: this.fb.array((this.data.notebook?.pages ?? []).map((p) => this.pageGroup(p))),
  });

  get pages(): FormArray { return this.form.controls.pages as FormArray; }
  get coverColor(): string { return this.form.controls.coverColor.value; }

  ngOnInit(): void { if (this.pages.length === 0) this.addPage(); }

  pickCover(color: string): void { this.form.controls.coverColor.setValue(color); }
  addPage(): void { this.pages.push(this.pageGroup()); }
  removePage(i: number): void { this.pages.removeAt(i); }

  submit(): void {
    if (this.form.invalid || this.pages.length === 0) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    const pages = (raw.pages as Array<{ heading: string; content: string }>).map((p, idx) =>
      new NotebookPage({
        id: this.data.notebook?.pages[idx]?.id ?? `p-${Date.now()}-${idx}`,
        heading: p.heading,
        content: p.content,
      }),
    );
    const command = new SaveNotebookCommand({
      id: this.data.notebook?.id,
      title: raw.title,
      subject: raw.subject,
      coverColor: raw.coverColor,
      pages,
    });
    this.loading.set(true);
    this.errorMsg.set(null);
    this.store.saveNotebook$(command).subscribe({
      next: (saved) => { this.loading.set(false); this.ref.close(saved); },
      error: (err) => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Error al guardar'); },
    });
  }

  cancel(): void { this.ref.close(); }

  private pageGroup(p?: NotebookPage): FormGroup {
    return this.fb.nonNullable.group({
      heading: [p?.heading ?? '', Validators.required],
      content: [p?.content ?? '', Validators.required],
    });
  }
}
