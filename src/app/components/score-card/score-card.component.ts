import { Component, Input } from '@angular/core';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils/classes-mapping.utils';
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
    selector: 'app-score-card',
    templateUrl: './score-card.component.html',
    imports: [TooltipComponent],
})
export class ScoreCardComponent {
    @Input() title!: string;
    @Input() subtitle!: string;
    @Input() score: number | null = null;
    @Input() icon: string = 'bullseye';
    @Input() level: string | null = null;
    @Input() info!: string;

    constructor() {
    }

    getScoreColor = getScoreColor;

    getScoreInPercentage = getScoreInPercentage;

    getScoreText = getScoreText;

    getScoreWidth(score: number | null | undefined): string {
        return score ? `${score * 100}%` : '0%';
    }
}
