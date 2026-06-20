import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Quiz } from '../domain/model/quiz.entity';
import { QuizQuestion } from '../domain/model/quiz-question';
import { QuizResource, QuizzesResponse } from './quiz-response';

export class QuizAssembler implements BaseAssembler<Quiz, QuizResource, QuizzesResponse> {
  toEntityFromResource(resource: QuizResource): Quiz {
    return new Quiz({
      id: resource.id,
      title: resource.title,
      subject: resource.subject,
      questions: (resource.questions ?? []).map(
        (q) => new QuizQuestion({
          id: q.id,
          prompt: q.prompt,
          options: q.options,
          correctKey: q.correctKey,
          explanation: q.explanation ?? '',
        }),
      ),
    });
  }

  toResourceFromEntity(entity: Quiz): QuizResource {
    return {
      id: entity.id,
      title: entity.title,
      subject: entity.subject,
      questions: entity.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
        correctKey: q.correctKey,
        explanation: q.explanation,
      })),
    };
  }

  toEntitiesFromResponse(_: QuizzesResponse): Quiz[] { return []; }
}
