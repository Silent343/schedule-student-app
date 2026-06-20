import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Subject } from '../../../shared/domain/model/subject';

/**
 * A study note ("apunte") pinned to the board: an image of class material
 * tagged by subject and the day it belongs to.
 */
export class Note implements BaseEntity {
  private _id: number;
  private _title: string;
  private _subject: Subject;
  private _imageUrl: string;
  private _dayLabel: string;
  private _createdAt: string;

  constructor(props: {
    id: number;
    title: string;
    subject: Subject;
    imageUrl: string;
    dayLabel: string;
    createdAt: string;
  }) {
    this._id = props.id;
    this._title = props.title;
    this._subject = props.subject;
    this._imageUrl = props.imageUrl;
    this._dayLabel = props.dayLabel;
    this._createdAt = props.createdAt;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get title(): string { return this._title; }
  set title(value: string) { this._title = value; }
  get subject(): Subject { return this._subject; }
  set subject(value: Subject) { this._subject = value; }
  get imageUrl(): string { return this._imageUrl; }
  set imageUrl(value: string) { this._imageUrl = value; }
  get dayLabel(): string { return this._dayLabel; }
  set dayLabel(value: string) { this._dayLabel = value; }
  get createdAt(): string { return this._createdAt; }
  set createdAt(value: string) { this._createdAt = value; }
}
