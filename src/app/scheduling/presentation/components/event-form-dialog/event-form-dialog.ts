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
import { SchedulingStore } from '../../../application/scheduling.store';
import { AcademicEvent } from '../../../domain/model/academic-event.entity';
import { EVENT_TYPES } from '../../../domain/model/event-type';
import { SaveEventCommand } from '../../../domain/model/save-event.command';

export interface EventDialogData {
  event?: AcademicEvent;
  date?: string;
}

/** Create/edit form for a calendar event. */
@Component({
  selector: 'app-event-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe,
  ],
  templateUrl: './event-form-dialog.html',
  styleUrl: './event-form-dialog.css',
})
export class EventFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<EventFormDialog>);
  private readonly store = inject(SchedulingStore);
  readonly data: EventDialogData = inject(MAT_DIALOG_DATA) ?? {};

  readonly subjects = SUBJECTS;
  readonly types = EVENT_TYPES;
  readonly isEdit = !!this.data.event;
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: [this.data.event?.title ?? '', [Validators.required, Validators.maxLength(80)]],
    subject: [this.data.event?.subject ?? 'math', Validators.required],
    type: [this.data.event?.type ?? 'task', Validators.required],
    date: [this.data.event?.date ?? this.data.date ?? new Date().toISOString().slice(0, 10), Validators.required],
    notes: [this.data.event?.notes ?? ''],
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.getRawValue();
    const command = new SaveEventCommand({ id: this.data.event?.id, ...v });
    this.loading.set(true);
    this.errorMsg.set(null);
    this.store.saveEvent$(command).subscribe({
      next: (saved) => { this.loading.set(false); this.ref.close(saved); },
      error: (err) => { this.loading.set(false); this.errorMsg.set(err.message ?? 'Error al guardar'); },
    });
  }

  deleteEvent(): void {
    if (!this.data.event) return;
    this.store.deleteEvent(this.data.event.id);
    this.ref.close('deleted');
  }

  cancel(): void { this.ref.close(); }
}
