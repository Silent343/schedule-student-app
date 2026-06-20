import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AcademicEvent } from '../domain/model/academic-event.entity';
import { EventResource, EventsResponse } from './event-response';

export class EventAssembler
  implements BaseAssembler<AcademicEvent, EventResource, EventsResponse>
{
  toEntityFromResource(resource: EventResource): AcademicEvent {
    return new AcademicEvent({
      id: resource.id,
      title: resource.title,
      subject: resource.subject,
      type: resource.type,
      date: resource.date,
      notes: resource.notes ?? '',
    });
  }

  toResourceFromEntity(entity: AcademicEvent): EventResource {
    return {
      id: entity.id,
      title: entity.title,
      subject: entity.subject,
      type: entity.type,
      date: entity.date,
      notes: entity.notes,
    };
  }

  toEntitiesFromResponse(_: EventsResponse): AcademicEvent[] { return []; }
}
