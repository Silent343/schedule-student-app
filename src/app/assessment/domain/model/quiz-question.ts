import { OptionKey } from './option-key';

export interface AnswerOption {
  key: OptionKey;
  label: string;
}

/**
 * A single multiple-choice question (value object inside the Quiz aggregate).
 * Knows how to grade an answer against its own correct key.
 */
export class QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: AnswerOption[];
  readonly correctKey: OptionKey;
  readonly explanation: string;

  constructor(props: {
    id: string;
    prompt: string;
    options: AnswerOption[];
    correctKey: OptionKey;
    explanation: string;
  }) {
    this.id = props.id;
    this.prompt = props.prompt;
    this.options = props.options;
    this.correctKey = props.correctKey;
    this.explanation = props.explanation;
  }

  isCorrect(answer: OptionKey | null): boolean {
    return answer === this.correctKey;
  }

  labelFor(key: OptionKey): string {
    return this.options.find((o) => o.key === key)?.label ?? '';
  }
}
