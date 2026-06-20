import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

interface ErrorResource { code: string; message: string; details: string; title: string; }

/**
 * Reusable HTTP error translation for infrastructure services.
 * Normalises any transport failure into a domain-friendly Error.
 */
export abstract class ErrorHandlingEnabledBaseType {
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
