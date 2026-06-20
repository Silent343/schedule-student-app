import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';
import { Quiz } from '../domain/model/quiz.entity';
import { QuizzesApiEndpoint } from './quizzes-api-endpoint';

/** Infrastructure facade for the assessment context. */
@Injectable({ providedIn: 'root' })
export class AssessmentApi extends BaseApi {
  private readonly quizzesEndpoint: QuizzesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.quizzesEndpoint = new QuizzesApiEndpoint(http);
  }

  getQuizzes(): Observable<Quiz[]> { return this.quizzesEndpoint.getAll(); }
  createQuiz(quiz: Quiz): Observable<Quiz> { return this.quizzesEndpoint.create(quiz); }
  updateQuiz(quiz: Quiz): Observable<Quiz> { return this.quizzesEndpoint.update(quiz, quiz.id); }
  deleteQuiz(id: number): Observable<void> { return this.quizzesEndpoint.delete(id); }
}
