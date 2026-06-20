import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AcademicEvent } from '../../../domain/model/academic-event.entity';
import { EVENT_TYPES } from '../../../domain/model/event-type';
import { subjectStyle } from '../../../../shared/presentation/util/subject-style';

/** Sidebar agenda of upcoming events. */
@Component({
  selector: 'app-agenda-list',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './agenda-list.html',
  styleUrl: './agenda-list.css',
})
export class AgendaList {
  @Input({ required: true }) events: AcademicEvent[] = [];
  @Output() openEvent = new EventEmitter<AcademicEvent>();

  protected readonly style = subjectStyle;

  iconFor(type: string): string {
    return EVENT_TYPES.find((t) => t.value === type)?.icon ?? 'event';
  }

  dayPart(iso: string): string {
    return String(new Date(iso + 'T00:00:00').getDate()).padStart(2, '0');
  }

  monthKey(iso: string): string {
    const m = new Date(iso + 'T00:00:00').getMonth();
    return 'scheduling.monthShort.' + m;
  }
}
