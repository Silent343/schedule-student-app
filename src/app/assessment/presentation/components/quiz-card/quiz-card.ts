import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

import { Quiz } from '../../../domain/model/quiz.entity';
import { subjectStyle } from '../../../../shared/presentation/util/subject-style';

/** Card summarising a quiz, with a primary "start" action. */
@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, TranslatePipe],
  templateUrl: './quiz-card.html',
  styleUrl: './quiz-card.css',
})
export class QuizCard {
  @Input({ required: true }) quiz!: Quiz;
  @Output() start = new EventEmitter<Quiz>();
  @Output() edit = new EventEmitter<Quiz>();
  @Output() remove = new EventEmitter<Quiz>();

  protected readonly style = subjectStyle;
}
