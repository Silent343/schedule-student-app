import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Notebook } from '../domain/model/notebook.entity';
import { NotebookAssembler } from './notebook-assembler';
import { NotebookResource, NotebooksResponse } from './notebook-response';

/** HTTP endpoint client for /notebooks. */
export class NotebooksApiEndpoint extends BaseApiEndpoint<
  Notebook, NotebookResource, NotebooksResponse, NotebookAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}${environment.notebooksEndpointPath}`, new NotebookAssembler());
  }
}
