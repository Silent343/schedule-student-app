import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { AcademicEvent } from '../domain/model/academic-event.entity';
import { SaveEventCommand } from '../domain/model/save-event.command';
import { SchedulingApi } from '../infrastructure/scheduling-api';

export interface CalendarCell {
  day: number;
  inMonth: boolean;
  isoDate: string;
  events: AcademicEvent[];
}

/**
 * Application service for the scheduling context. Holds the event list plus the
 * currently viewed month, and projects both into a calendar grid (the month
 * math is application logic, kept out of the components).
 */
@Injectable({ providedIn: 'root' })
export class SchedulingStore {
  private readonly api = inject(SchedulingApi);

  private readonly eventsSignal = signal<AcademicEvent[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly cursorSignal = signal<{ year: number; month: number }>(this.currentMonth());

  readonly events = this.eventsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly cursor = this.cursorSignal.asReadonly();

  /** 6×7 grid of cells for the cursor month, each carrying its events. */
  readonly grid = computed<CalendarCell[]>(() => {
    const { year, month } = this.cursorSignal();
    const events = this.eventsSignal();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: CalendarCell[] = [];
    for (let i = 0; i < 42; i++) {
      const dayNum = i - startOffset + 1;
      let cellYear = year;
      let cellMonth = month;
      let day = dayNum;
      let inMonth = true;

      if (dayNum <= 0) {
        inMonth = false; cellMonth = month - 1; day = daysInPrev + dayNum;
        if (cellMonth < 0) { cellMonth = 11; cellYear = year - 1; }
      } else if (dayNum > daysInMonth) {
        inMonth = false; cellMonth = month + 1; day = dayNum - daysInMonth;
        if (cellMonth > 11) { cellMonth = 0; cellYear = year + 1; }
      }

      const iso = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = inMonth ? events.filter((e) => e.isOn(year, month, day)) : [];
      cells.push({ day, inMonth, isoDate: iso, events: dayEvents });
    }
    return cells;
  });

  /** Upcoming events from today onward, sorted ascending — feeds the agenda. */
  readonly upcoming = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return [...this.eventsSignal()]
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);
  });

  loadEvents(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getEvents().subscribe({
      next: (events) => { this.eventsSignal.set(events); this.loadingSignal.set(false); },
      error: (err) => {
        this.errorSignal.set(err.message ?? 'No se pudieron cargar los eventos');
        this.loadingSignal.set(false);
      },
    });
  }

  goToPrevMonth(): void {
    this.cursorSignal.update(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
  }

  goToNextMonth(): void {
    this.cursorSignal.update(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });
  }

  goToToday(): void {
    this.cursorSignal.set(this.currentMonth());
  }

  saveEvent$(command: SaveEventCommand): Observable<AcademicEvent> {
    return command.id !== undefined ? this.updateEvent$(command, command.id) : this.createEvent$(command);
  }

  deleteEvent(id: number): void {
    this.api.deleteEvent(id).subscribe({
      next: () => this.eventsSignal.update((list) => list.filter((e) => e.id !== id)),
      error: (err) => this.errorSignal.set(err.message ?? 'No se pudo eliminar el evento'),
    });
  }

  private createEvent$(c: SaveEventCommand): Observable<AcademicEvent> {
    const event = new AcademicEvent({ id: 0, title: c.title, subject: c.subject, type: c.type, date: c.date, notes: c.notes });
    return this.api.createEvent(event).pipe(
      tap((created) => this.eventsSignal.update((list) => [...list, created])),
    );
  }

  private updateEvent$(c: SaveEventCommand, id: number): Observable<AcademicEvent> {
    const event = new AcademicEvent({ id, title: c.title, subject: c.subject, type: c.type, date: c.date, notes: c.notes });
    return this.api.updateEvent(event).pipe(
      tap((updated) => this.eventsSignal.update((list) => list.map((e) => (e.id === updated.id ? updated : e)))),
    );
  }

  private currentMonth(): { year: number; month: number } {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }
}
