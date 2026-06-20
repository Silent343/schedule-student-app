import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { Notebook } from '../domain/model/notebook.entity';
import { SaveNotebookCommand } from '../domain/model/save-notebook.command';
import { NotebookApi } from '../infrastructure/notebook-api';

/** Application service for the notebook context. */
@Injectable({ providedIn: 'root' })
export class NotebookStore {
  private readonly api = inject(NotebookApi);

  private readonly notebooksSignal = signal<Notebook[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly notebooks = this.notebooksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly total = computed(() => this.notebooksSignal().length);
  readonly pageTotal = computed(() =>
    this.notebooksSignal().reduce((sum, n) => sum + n.pageCount, 0),
  );

  loadNotebooks(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.api.getNotebooks().subscribe({
      next: (notebooks) => { this.notebooksSignal.set(notebooks); this.loadingSignal.set(false); },
      error: (err) => {
        this.errorSignal.set(err.message ?? 'No se pudieron cargar los cuadernos');
        this.loadingSignal.set(false);
      },
    });
  }

  saveNotebook$(command: SaveNotebookCommand): Observable<Notebook> {
    return command.id !== undefined
      ? this.updateNotebook$(command, command.id)
      : this.createNotebook$(command);
  }

  deleteNotebook(id: number): void {
    this.api.deleteNotebook(id).subscribe({
      next: () => this.notebooksSignal.update((list) => list.filter((n) => n.id !== id)),
      error: (err) => this.errorSignal.set(err.message ?? 'No se pudo eliminar el cuaderno'),
    });
  }

  private createNotebook$(c: SaveNotebookCommand): Observable<Notebook> {
    const notebook = new Notebook({ id: 0, title: c.title, subject: c.subject, coverColor: c.coverColor, pages: c.pages });
    return this.api.createNotebook(notebook).pipe(
      tap((created) => this.notebooksSignal.update((list) => [created, ...list])),
    );
  }

  private updateNotebook$(c: SaveNotebookCommand, id: number): Observable<Notebook> {
    const notebook = new Notebook({ id, title: c.title, subject: c.subject, coverColor: c.coverColor, pages: c.pages });
    return this.api.updateNotebook(notebook).pipe(
      tap((updated) => this.notebooksSignal.update((list) => list.map((n) => (n.id === updated.id ? updated : n)))),
    );
  }
}
