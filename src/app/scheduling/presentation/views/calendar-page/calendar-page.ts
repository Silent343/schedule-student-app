import { Component, OnInit, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { SchedulingStore } from '../../../application/scheduling.store';
import { AcademicEvent } from '../../../domain/model/academic-event.entity';
import { AgendaList } from '../../components/agenda-list/agenda-list';
import { CalendarGrid } from '../../components/calendar-grid/calendar-grid';
import { EventDialogData, EventFormDialog } from '../../components/event-form-dialog/event-form-dialog';

/** "Calendario" — month view + agenda. Composition root for scheduling. */
@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, CalendarGrid, AgendaList, TranslatePipe],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.css',
})
export class CalendarPage implements OnInit {
  private readonly store = inject(SchedulingStore);
  private readonly dialog = inject(MatDialog);

  readonly grid = this.store.grid;
  readonly upcoming = this.store.upcoming;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly todayIso = new Date().toISOString().slice(0, 10);

  readonly monthLabelKey = computed(() => 'scheduling.month.' + this.store.cursor().month);
  readonly year = computed(() => this.store.cursor().year);

  ngOnInit(): void { this.store.loadEvents(); }

  prev(): void { this.store.goToPrevMonth(); }
  next(): void { this.store.goToNextMonth(); }
  today(): void { this.store.goToToday(); }

  openCreate(date?: string): void {
    this.dialog.open(EventFormDialog, this.cfg({ date }));
  }
  openEdit(event: AcademicEvent): void {
    this.dialog.open(EventFormDialog, this.cfg({ event }));
  }

  private cfg(data: EventDialogData) {
    return { panelClass: 'aula-dialog', maxWidth: '95vw', autoFocus: false, data };
  }
}
