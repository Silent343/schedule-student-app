import { Subject } from '../../../shared/domain/model/subject';
import { EventType } from './event-type';

/** Command to create or update a calendar event. */
export class SaveEventCommand {
  readonly title: string;
  readonly subject: Subject;
  readonly type: EventType;
  readonly date: string;
  readonly notes: string;
  readonly id?: number;

  constructor(props: {
    title: string; subject: Subject; type: EventType; date: string; notes: string; id?: number;
  }) {
    this.title = props.title;
    this.subject = props.subject;
    this.type = props.type;
    this.date = props.date;
    this.notes = props.notes;
    this.id = props.id;
  }
}
