import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** Compact stat strip shown above the board grid. */
@Component({
  selector: 'app-board-summary',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './board-summary.html',
  styleUrl: './board-summary.css',
})
export class BoardSummary {
  @Input({ required: true }) total = 0;
  @Input({ required: true }) subjects = 0;
  @Input({ required: true }) days = 0;
}
