import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

import { Notebook } from '../../../domain/model/notebook.entity';
import { subjectStyle } from '../../../../shared/presentation/util/subject-style';

/** Book-cover style card for a saved notebook. */
@Component({
  selector: 'app-notebook-card',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, TranslatePipe],
  templateUrl: './notebook-card.html',
  styleUrl: './notebook-card.css',
})
export class NotebookCard {
  @Input({ required: true }) notebook!: Notebook;
  @Output() open = new EventEmitter<Notebook>();
  @Output() edit = new EventEmitter<Notebook>();
  @Output() remove = new EventEmitter<Notebook>();

  protected readonly style = subjectStyle;
}
