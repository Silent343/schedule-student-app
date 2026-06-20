import { Subject } from '../../../shared/domain/model/subject';

/**
 * Command capturing everything needed to create or update a note.
 * Presence of `id` distinguishes an update from a create.
 */
export class SaveNoteCommand {
  readonly title: string;
  readonly subject: Subject;
  readonly imageUrl: string;
  readonly dayLabel: string;
  readonly id?: number;

  constructor(props: {
    title: string;
    subject: Subject;
    imageUrl: string;
    dayLabel: string;
    id?: number;
  }) {
    this.title = props.title;
    this.subject = props.subject;
    this.imageUrl = props.imageUrl;
    this.dayLabel = props.dayLabel;
    this.id = props.id;
  }
}
