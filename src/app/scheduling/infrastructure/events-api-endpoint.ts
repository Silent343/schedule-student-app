import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AcademicEvent } from '../domain/model/academic-event.entity';
import { EventAssembler } from './event-assembler';
import { EventResource, EventsResponse } from './event-response';

/** HTTP endpoint client for /events. */
export class EventsApiEndpoint extends BaseApiEndpoint<
  AcademicEvent, EventResource, EventsResponse, EventAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.apiBaseUrl}${environment.eventsEndpointPath}`,
      new EventAssembler(),
    );
  }
}
