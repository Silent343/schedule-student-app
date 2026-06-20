import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { BaseEntity } from '../domain/model/base-entity';
import { BaseAssembler } from './base-assembler';
import { BaseResource, BaseResponse } from './base-response';

interface ErrorResource {
  code: string;
  message: string;
  details: string;
  title: string;
}

/**
 * Reusable CRUD endpoint client for a single API resource.
 *
 * Subclasses bind concrete entity/resource/response/assembler types and pass
 * the endpoint URL through the constructor. This is the single place where the
 * full create/read/update/delete contract lives (Single Responsibility), so
 * every bounded context inherits a consistent, tested transport layer.
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>,
> {
  protected constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler,
  ) {}

  getAll(): Observable<TEntity[]> {
    return this.http.get<TResponse | TResource[]>(this.endpointUrl).pipe(
      map((response) =>
        Array.isArray(response)
          ? response.map((r) => this.assembler.toEntityFromResource(r))
          : this.assembler.toEntitiesFromResponse(response as TResponse),
      ),
      catchError(this.handleError('No se pudieron obtener los registros')),
    );
  }

  getById(id: number): Observable<TEntity> {
    return this.http.get<TResource>(`${this.endpointUrl}/${id}`).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`No se pudo obtener el registro ${id}`)),
    );
  }

  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<TResource>(this.endpointUrl, resource).pipe(
      map((created) => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('No se pudo crear el registro')),
    );
  }

  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<TResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map((updated) => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError(`No se pudo actualizar el registro ${id}`)),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`).pipe(
      catchError(this.handleError(`No se pudo eliminar el registro ${id}`)),
    );
  }

  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let message: string;
      if (error.error instanceof ErrorEvent) {
        message = error.error.message;
      } else if (error.error && typeof error.error === 'object') {
        const body = error.error as ErrorResource;
        message = body.message || body.title || body.details || `${operation}: ${error.status}`;
      } else {
        message = `${operation}: ${error.status || 'Error inesperado'}`;
      }
      return throwError(() => new Error(message));
    };
  }
}
