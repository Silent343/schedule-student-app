import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { Subject } from '../../shared/domain/model/subject';

export interface NoteResource extends BaseResource {
  id: number;
  title: string;
  subject: Subject;
  imageUrl: string;
  dayLabel: string;
  createdAt: string;
}

export interface NotesResponse extends BaseResponse {}
