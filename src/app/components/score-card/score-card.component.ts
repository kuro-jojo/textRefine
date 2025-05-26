import { Component, Input } from '@angular/core';
import { SCORE_COLORS } from '../../utils';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
})
export class ScoreCardComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() score: number | null = null;
  @Input() icon: string = 'bullseye';
  @Input() level: string | null = null;

  constructor() {
  }

  getScoreColor = getScoreColor;

  getScoreInPercentage = getScoreInPercentage;

  getScoreText = getScoreText;

  getScoreWidth(score: number | null | undefined): string {
    return score ? `${score * 100}%` : '0%';
  }
}
