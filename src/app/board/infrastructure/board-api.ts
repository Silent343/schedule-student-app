import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { Note } from '../domain/model/note.entity';
import { NotesApiEndpoint } from './notes-api-endpoint';

/**
 * Coarse-grained facade the application layer talks to. Hides the existence of
 * individual endpoint clients from the store (Interface Segregation).
 */
@Injectable({ providedIn: 'root' })
export class BoardApi extends BaseApi {
  private readonly notesEndpoint: NotesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.notesEndpoint = new NotesApiEndpoint(http);
  }

  getNotes(): Observable<Note[]> { return this.notesEndpoint.getAll(); }
  createNote(note: Note): Observable<Note> { return this.notesEndpoint.create(note); }
  updateNote(note: Note): Observable<Note> { return this.notesEndpoint.update(note, note.id); }
  deleteNote(id: number): Observable<void> { return this.notesEndpoint.delete(id); }
}
