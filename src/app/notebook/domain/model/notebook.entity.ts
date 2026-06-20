import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Subject } from '../../../shared/domain/model/subject';
import { NotebookPage } from './notebook-page';

/**
 * Aggregate root for a saved notebook: a titled, subject-tagged set of pages.
 */
export class Notebook implements BaseEntity {
  private _id: number;
  private _title: string;
  private _subject: Subject;
  private _coverColor: string;
  private _pages: NotebookPage[];

  constructor(props: {
    id: number;
    title: string;
    subject: Subject;
    coverColor: string;
    pages: NotebookPage[];
  }) {
    this._id = props.id;
    this._title = props.title;
    this._subject = props.subject;
    this._coverColor = props.coverColor;
    this._pages = props.pages;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get title(): string { return this._title; }
  set title(value: string) { this._title = value; }
  get subject(): Subject { return this._subject; }
  set subject(value: Subject) { this._subject = value; }
  get coverColor(): string { return this._coverColor; }
  set coverColor(value: string) { this._coverColor = value; }
  get pages(): NotebookPage[] { return this._pages; }
  set pages(value: NotebookPage[]) { this._pages = value; }

  get pageCount(): number { return this._pages.length; }
  get totalWords(): number { return this._pages.reduce((s, p) => s + p.wordCount, 0); }
  get readingMinutes(): number { return Math.max(1, Math.round(this.totalWords / 200)); }
}
