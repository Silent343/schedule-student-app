import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Quiz } from '../domain/model/quiz.entity';
import { QuizAssembler } from './quiz-assembler';
import { QuizResource, QuizzesResponse } from './quiz-response';

/** HTTP endpoint client for /quizzes. */
export class QuizzesApiEndpoint extends BaseApiEndpoint<
  Quiz, QuizResource, QuizzesResponse, QuizAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}${environment.quizzesEndpointPath}`, new QuizAssembler());
  }
}
