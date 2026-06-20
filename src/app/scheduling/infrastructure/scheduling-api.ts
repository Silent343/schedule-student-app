import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { AcademicEvent } from '../domain/model/academic-event.entity';
import { EventsApiEndpoint } from './events-api-endpoint';

/** Infrastructure facade for the scheduling context. */
@Injectable({ providedIn: 'root' })
export class SchedulingApi extends BaseApi {
  private readonly eventsEndpoint: EventsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.eventsEndpoint = new EventsApiEndpoint(http);
  }

  getEvents(): Observable<AcademicEvent[]> { return this.eventsEndpoint.getAll(); }
  createEvent(event: AcademicEvent): Observable<AcademicEvent> { return this.eventsEndpoint.create(event); }
  updateEvent(event: AcademicEvent): Observable<AcademicEvent> { return this.eventsEndpoint.update(event, event.id); }
  deleteEvent(id: number): Observable<void> { return this.eventsEndpoint.delete(id); }
}
