import { Subject } from '../../../shared/domain/model/subject';
import { NotebookPage } from './notebook-page';

/** Command to create or update a notebook with its full page set. */
export class SaveNotebookCommand {
  readonly title: string;
  readonly subject: Subject;
  readonly coverColor: string;
  readonly pages: NotebookPage[];
  readonly id?: number;

  constructor(props: {
    title: string; subject: Subject; coverColor: string; pages: NotebookPage[]; id?: number;
  }) {
    this.title = props.title;
    this.subject = props.subject;
    this.coverColor = props.coverColor;
    this.pages = props.pages;
    this.id = props.id;
  }
}
