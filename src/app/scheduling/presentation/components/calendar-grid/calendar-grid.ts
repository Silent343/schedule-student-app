import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { CalendarCell } from '../../../application/scheduling.store';
import { AcademicEvent } from '../../../domain/model/academic-event.entity';
import { subjectStyle } from '../../../../shared/presentation/util/subject-style';

/** Pure month grid. Receives cells, emits day/event intents. */
@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './calendar-grid.html',
  styleUrl: './calendar-grid.css',
})
export class CalendarGrid {
  @Input({ required: true }) cells: CalendarCell[] = [];
  @Input() todayIso = new Date().toISOString().slice(0, 10);
  @Output() addOnDay = new EventEmitter<string>();
  @Output() openEvent = new EventEmitter<AcademicEvent>();

  readonly weekdays = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  protected readonly style = subjectStyle;
}
