import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Subject } from '../../../shared/domain/model/subject';
import { EventType } from './event-type';

/**
 * An item on the academic calendar (exam, task, class or reminder), anchored to
 * a single ISO date (yyyy-mm-dd).
 */
export class AcademicEvent implements BaseEntity {
  private _id: number;
  private _title: string;
  private _subject: Subject;
  private _type: EventType;
  private _date: string;
  private _notes: string;

  constructor(props: {
    id: number;
    title: string;
    subject: Subject;
    type: EventType;
    date: string;
    notes: string;
  }) {
    this._id = props.id;
    this._title = props.title;
    this._subject = props.subject;
    this._type = props.type;
    this._date = props.date;
    this._notes = props.notes;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get title(): string { return this._title; }
  set title(value: string) { this._title = value; }
  get subject(): Subject { return this._subject; }
  set subject(value: Subject) { this._subject = value; }
  get type(): EventType { return this._type; }
  set type(value: EventType) { this._type = value; }
  get date(): string { return this._date; }
  set date(value: string) { this._date = value; }
  get notes(): string { return this._notes; }
  set notes(value: string) { this._notes = value; }

  /** Day-of-month, used to drop the event onto a calendar cell. */
  get dayOfMonth(): number { return new Date(this._date + 'T00:00:00').getDate(); }

  isOn(year: number, month: number, day: number): boolean {
    const d = new Date(this._date + 'T00:00:00');
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  }
}
