import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { Subject } from '../../shared/domain/model/subject';

export interface NotebookPageResource { id: string; heading: string; content: string; }

export interface NotebookResource extends BaseResource {
  id: number;
  title: string;
  subject: Subject;
  coverColor: string;
  pages: NotebookPageResource[];
}

export interface NotebooksResponse extends BaseResponse {}
