import { Component, Input } from '@angular/core';
import { getScoreInPercentage, getScoreText } from '../../utils';

@Component({
  selector: 'app-overall-score',
  templateUrl: './overall-score.component.html',
})
export class OverallScoreComponent {
  @Input() score: number | null = null;
  @Input() sophisticationLevel: string | null = null;
  @Input() wordCount: number | null = null;
  @Input() uniqueCount: number | null = null;

  getScoreInPercentage(score: number | null | undefined): string {
    return getScoreInPercentage(score);
  }

  getScoreText(score: number | null | undefined): string {
    return getScoreText(score);
  }
}
