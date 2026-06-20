import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { Notebook } from '../../../domain/model/notebook.entity';
import { NotebookPage } from '../../../domain/model/notebook-page';
import { subjectStyle } from '../../../../shared/presentation/util/subject-style';

export interface NotebookReaderData {
  notebook: Notebook;
}

/** Page-by-page reader for a notebook. */
@Component({
  selector: 'app-notebook-reader',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './notebook-reader.html',
  styleUrl: './notebook-reader.css',
})
export class NotebookReader {
  private readonly ref = inject(MatDialogRef<NotebookReader>);
  readonly data: NotebookReaderData = inject(MAT_DIALOG_DATA);

  protected readonly style = subjectStyle;
  readonly notebook = this.data.notebook;
  readonly index = signal(0);

  get page(): NotebookPage | undefined { return this.notebook.pages[this.index()]; }
  get hasPages(): boolean { return this.notebook.pageCount > 0; }

  prev(): void { if (this.index() > 0) this.index.update((i) => i - 1); }
  next(): void { if (this.index() < this.notebook.pageCount - 1) this.index.update((i) => i + 1); }
  close(): void { this.ref.close(); }
}
