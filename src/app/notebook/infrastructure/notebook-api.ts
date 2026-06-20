import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { Notebook } from '../domain/model/notebook.entity';
import { NotebooksApiEndpoint } from './notebooks-api-endpoint';

/** Infrastructure facade for the notebook context. */
@Injectable({ providedIn: 'root' })
export class NotebookApi extends BaseApi {
  private readonly notebooksEndpoint: NotebooksApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.notebooksEndpoint = new NotebooksApiEndpoint(http);
  }

  getNotebooks(): Observable<Notebook[]> { return this.notebooksEndpoint.getAll(); }
  createNotebook(n: Notebook): Observable<Notebook> { return this.notebooksEndpoint.create(n); }
  updateNotebook(n: Notebook): Observable<Notebook> { return this.notebooksEndpoint.update(n, n.id); }
  deleteNotebook(id: number): Observable<void> { return this.notebooksEndpoint.delete(id); }
}
