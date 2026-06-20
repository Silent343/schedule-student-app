import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog';
import { NotebookStore } from '../../../application/notebook.store';
import { Notebook } from '../../../domain/model/notebook.entity';
import { NotebookCard } from '../../components/notebook-card/notebook-card';
import { NotebookDialogData, NotebookFormDialog } from '../../components/notebook-form-dialog/notebook-form-dialog';
import { NotebookReader, NotebookReaderData } from '../../components/notebook-reader/notebook-reader';

/** "Cuaderno" — saved-notebook library + reader. Composition root for notebook. */
@Component({
  selector: 'app-notebook-page',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, NotebookCard, TranslatePipe],
  templateUrl: './notebook-page.html',
  styleUrl: './notebook-page.css',
})
export class NotebookPageView implements OnInit {
  private readonly store = inject(NotebookStore);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  readonly notebooks = this.store.notebooks;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  ngOnInit(): void { this.store.loadNotebooks(); }

  read(notebook: Notebook): void {
    this.dialog.open(NotebookReader, {
      panelClass: 'aula-dialog', maxWidth: '95vw', autoFocus: false,
      data: { notebook } as NotebookReaderData,
    });
  }

  openCreate(): void { this.dialog.open(NotebookFormDialog, this.cfg({})); }
  openEdit(notebook: Notebook): void { this.dialog.open(NotebookFormDialog, this.cfg({ notebook })); }

  remove(notebook: Notebook): void {
    const data: ConfirmDialogData = {
      title: this.translate.instant('notebook.delete.title'),
      message: this.translate.instant('notebook.delete.message', { title: notebook.title }),
      confirmLabel: this.translate.instant('common.delete'),
      cancelLabel: this.translate.instant('common.cancel'),
    };
    this.dialog.open(ConfirmDialog, { panelClass: 'aula-dialog', data, autoFocus: false })
      .afterClosed().subscribe((ok) => ok && this.store.deleteNotebook(notebook.id));
  }

  private cfg(data: NotebookDialogData) {
    return { panelClass: 'aula-dialog', maxWidth: '95vw', autoFocus: false, data };
  }
}
