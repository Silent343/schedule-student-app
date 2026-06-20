import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Subject } from '../../../shared/domain/model/subject';
import { QuizQuestion } from './quiz-question';

/**
 * Aggregate root for a practice quiz: a titled set of questions on one subject.
 */
export class Quiz implements BaseEntity {
  private _id: number;
  private _title: string;
  private _subject: Subject;
  private _questions: QuizQuestion[];

  constructor(props: { id: number; title: string; subject: Subject; questions: QuizQuestion[] }) {
    this._id = props.id;
    this._title = props.title;
    this._subject = props.subject;
    this._questions = props.questions;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get title(): string { return this._title; }
  set title(value: string) { this._title = value; }
  get subject(): Subject { return this._subject; }
  set subject(value: Subject) { this._subject = value; }
  get questions(): QuizQuestion[] { return this._questions; }
  set questions(value: QuizQuestion[]) { this._questions = value; }

  get questionCount(): number { return this._questions.length; }
}
