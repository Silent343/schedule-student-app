import { Subject } from '../../../shared/domain/model/subject';
import { QuizQuestion } from './quiz-question';

/** Command to create or update a quiz (with its full question set). */
export class SaveQuizCommand {
  readonly title: string;
  readonly subject: Subject;
  readonly questions: QuizQuestion[];
  readonly id?: number;

  constructor(props: { title: string; subject: Subject; questions: QuizQuestion[]; id?: number }) {
    this.title = props.title;
    this.subject = props.subject;
    this.questions = props.questions;
    this.id = props.id;
  }
}
