import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Note } from '../domain/model/note.entity';
import { NoteAssembler } from './note-assembler';
import { NoteResource, NotesResponse } from './note-response';

/** HTTP endpoint client for /notes (full CRUD inherited from BaseApiEndpoint). */
export class NotesApiEndpoint extends BaseApiEndpoint<
  Note,
  NoteResource,
  NotesResponse,
  NoteAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.apiBaseUrl}${environment.notesEndpointPath}`,
      new NoteAssembler(),
    );
  }
}
