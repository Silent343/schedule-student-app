import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

/** Reusable destructive-action confirmation. Returns true on confirm. */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  private readonly ref = inject(MatDialogRef<ConfirmDialog, boolean>);
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  confirm(): void { this.ref.close(true); }
  cancel(): void { this.ref.close(false); }
}
