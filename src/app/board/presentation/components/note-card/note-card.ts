import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

import { Note } from '../../../domain/model/note.entity';
import { subjectStyle } from '../../../../shared/presentation/util/subject-style';

/** Presentational card for a single board note. Emits intents only. */
@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, TranslatePipe],
  templateUrl: './note-card.html',
  styleUrl: './note-card.css',
})
export class NoteCard {
  @Input({ required: true }) note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() remove = new EventEmitter<Note>();
  @Output() preview = new EventEmitter<Note>();

  protected readonly style = subjectStyle;
}
