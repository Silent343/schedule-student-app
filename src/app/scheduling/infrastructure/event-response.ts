import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { Subject } from '../../shared/domain/model/subject';
import { EventType } from '../domain/model/event-type';

export interface EventResource extends BaseResource {
  id: number;
  title: string;
  subject: Subject;
  type: EventType;
  date: string;
  notes: string;
}

export interface EventsResponse extends BaseResponse {}
