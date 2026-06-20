import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { Subject, SUBJECTS } from '../../../../shared/domain/model/subject';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog';
import { BoardStore } from '../../../application/board.store';
import { Note } from '../../../domain/model/note.entity';
import { BoardSummary } from '../../components/board-summary/board-summary';
import { NoteCard } from '../../components/note-card/note-card';
import { NoteDialogData, NoteFormDialog } from '../../components/note-form-dialog/note-form-dialog';

/** "Tablero" — the study-notes board. Composition root for the board context UI. */
@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, NoteCard, BoardSummary, TranslatePipe],
  templateUrl: './board-page.html',
  styleUrl: './board-page.css',
})
export class BoardPage implements OnInit {
  private readonly store = inject(BoardStore);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  readonly subjects = SUBJECTS;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly total = this.store.total;
  readonly subjectsCovered = this.store.subjectsCovered;

  readonly activeFilter = signal<Subject | 'all'>('all');

  readonly visibleGroups = computed(() => {
    const filter = this.activeFilter();
    return this.store
      .notesByDay()
      .map((g) => ({ day: g.day, notes: this.store.filterBySubject(g.notes, filter) }))
      .filter((g) => g.notes.length > 0);
  });

  readonly dayCount = computed(() => this.store.notesByDay().length);

  ngOnInit(): void {
    this.store.loadNotes();
  }

  setFilter(value: Subject | 'all'): void {
    this.activeFilter.set(value);
  }

  openCreate(): void {
    this.dialog.open(NoteFormDialog, this.dialogConfig({}));
  }

  openEdit(note: Note): void {
    this.dialog.open(NoteFormDialog, this.dialogConfig({ note }));
  }

  preview(note: Note): void {
    Swal.fire({
      title: note.title,
      imageUrl: note.imageUrl,
      imageAlt: note.title,
      width: 'min(720px, 92vw)',
      confirmButtonText: this.translate.instant('common.close'),
      confirmButtonColor: '#3d4db7',
    });
  }

  remove(note: Note): void {
    const data: ConfirmDialogData = {
      title: this.translate.instant('board.delete.title'),
      message: this.translate.instant('board.delete.message', { title: note.title }),
      confirmLabel: this.translate.instant('common.delete'),
      cancelLabel: this.translate.instant('common.cancel'),
    };
    this.dialog
      .open(ConfirmDialog, { panelClass: 'aula-dialog', data, autoFocus: false })
      .afterClosed()
      .subscribe((ok) => ok && this.store.deleteNote(note.id));
  }

  private dialogConfig(data: NoteDialogData) {
    return { panelClass: 'aula-dialog', maxWidth: '95vw', autoFocus: false, data };
  }
}
