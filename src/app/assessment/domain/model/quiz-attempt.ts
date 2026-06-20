import { OptionKey } from './option-key';
import { Quiz } from './quiz.entity';

export interface QuestionResult {
  questionId: string;
  chosen: OptionKey | null;
  correctKey: OptionKey;
  correct: boolean;
}

export interface AttemptResult {
  total: number;
  correct: number;
  scorePercent: number;
  results: QuestionResult[];
}

/**
 * Domain service that grades a set of answers against a quiz. Pure logic, no
 * framework or transport — this is the heart of the assessment context.
 */
export class QuizAttempt {
  constructor(private readonly quiz: Quiz) {}

  evaluate(answers: ReadonlyMap<string, OptionKey | null>): AttemptResult {
    const results: QuestionResult[] = this.quiz.questions.map((q) => {
      const chosen = answers.get(q.id) ?? null;
      return { questionId: q.id, chosen, correctKey: q.correctKey, correct: q.isCorrect(chosen) };
    });
    const correct = results.filter((r) => r.correct).length;
    const total = results.length;
    return {
      total,
      correct,
      scorePercent: total === 0 ? 0 : Math.round((correct / total) * 100),
      results,
    };
  }
}
