import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Subject } from '../../shared/domain/model/subject';
import { Note } from '../domain/model/note.entity';
import { SaveNoteCommand } from '../domain/model/save-note.command';
import { BoardApi } from '../infrastructure/board-api';

/**
 * Application service for the board context. Owns the in-memory note state as
 * signals and orchestrates the infrastructure facade. Components stay dumb:
 * they read signals and dispatch commands.
 */
@Injectable({ providedIn: 'root' })
export class BoardStore {
  private readonly boardApi = inject(BoardApi);

  private readonly notesSignal = signal<Note[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly notes = this.notesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Notes grouped by day, ready for the board's day columns. */
  readonly notesByDay = computed(() => {
    const groups = new Map<string, Note[]>();
    for (const note of this.notesSignal()) {
      const bucket = groups.get(note.dayLabel) ?? [];
      bucket.push(note);
      groups.set(note.dayLabel, bucket);
    }
    return Array.from(groups, ([day, notes]) => ({ day, notes }));
  });

  readonly total = computed(() => this.notesSignal().length);

  readonly subjectsCovered = computed(
    () => new Set(this.notesSignal().map((n) => n.subject)).size,
  );

  loadNotes(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.boardApi.getNotes().subscribe({
      next: (notes) => {
        this.notesSignal.set(notes);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err.message ?? 'No se pudieron cargar los apuntes');
        this.loadingSignal.set(false);
      },
    });
  }

  saveNote$(command: SaveNoteCommand): Observable<Note> {
    return command.id !== undefined
      ? this.updateNote$(command, command.id)
      : this.createNote$(command);
  }

  deleteNote(id: number): void {
    this.boardApi.deleteNote(id).subscribe({
      next: () => this.notesSignal.update((list) => list.filter((n) => n.id !== id)),
      error: (err) => this.errorSignal.set(err.message ?? 'No se pudo eliminar el apunte'),
    });
  }

  filterBySubject(notes: Note[], subject: Subject | 'all'): Note[] {
    return subject === 'all' ? notes : notes.filter((n) => n.subject === subject);
  }

  private createNote$(command: SaveNoteCommand): Observable<Note> {
    const note = new Note({
      id: 0,
      title: command.title,
      subject: command.subject,
      imageUrl: command.imageUrl,
      dayLabel: command.dayLabel,
      createdAt: new Date().toISOString(),
    });
    return this.boardApi.createNote(note).pipe(
      tap((created) => this.notesSignal.update((list) => [created, ...list])),
    );
  }

  private updateNote$(command: SaveNoteCommand, id: number): Observable<Note> {
    const current = this.notesSignal().find((n) => n.id === id);
    const note = new Note({
      id,
      title: command.title,
      subject: command.subject,
      imageUrl: command.imageUrl,
      dayLabel: command.dayLabel,
      createdAt: current?.createdAt ?? new Date().toISOString(),
    });
    return this.boardApi.updateNote(note).pipe(
      tap((updated) =>
        this.notesSignal.update((list) => list.map((n) => (n.id === updated.id ? updated : n))),
      ),
    );
  }
}
