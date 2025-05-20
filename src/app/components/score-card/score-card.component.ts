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
    // Required for strict initialization
  }

  getScoreColor(score: number | null | undefined): { text: string; bg: string; all: string; } {
    return getScoreColor(score);
  }

  getScoreInPercentage(score: number | null | undefined): string {
    return getScoreInPercentage(score);
  }

  getScoreText(score: number | null | undefined): string {
    return getScoreText(score);
  }

  getScoreWidth(score: number | null | undefined): string {
    return score ? `${score * 100}%` : '0%';
  }
}
