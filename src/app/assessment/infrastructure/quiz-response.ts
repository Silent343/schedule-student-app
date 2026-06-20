import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { Subject } from '../../shared/domain/model/subject';
import { OptionKey } from '../domain/model/option-key';

export interface AnswerOptionResource { key: OptionKey; label: string; }

export interface QuestionResource {
  id: string;
  prompt: string;
  options: AnswerOptionResource[];
  correctKey: OptionKey;
  explanation: string;
}

export interface QuizResource extends BaseResource {
  id: number;
  title: string;
  subject: Subject;
  questions: QuestionResource[];
}

export interface QuizzesResponse extends BaseResponse {}
