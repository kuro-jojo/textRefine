import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getScoreInPercentage, getScoreText } from '../../utils';

@Component({
    selector: 'app-overall-score',
    templateUrl: './overall-score.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class OverallScoreComponent {
    @Input() score: number | null = null;
    @Input() sophisticationLevel: string | null = null;
    @Input() sophisticationColor: string | null = null;
    @Input() wordCount: number | null = null;
    @Input() rareWordCount: number | null = null;
    @Input() feedback: string | null = null;
    _score: number = 0;
    getScoreInPercentage = getScoreInPercentage;
    getScoreText = getScoreText;

    Math = Math;

    ngOnInit(): void {
        if (!this.score) return;
        const interval = setInterval(() => {
            this._score += .1;
            if (this._score >= this.score!) {
                this._score = this.score!;
                clearInterval(interval);
            }
        }, 15);
    }

    getOverallScoreSvgPercentage(radius: number): [string, string] {
        const circumference = 2 * Math.PI * radius;
        if (!this._score) {
            return [`${circumference}px`, `${Math.round(circumference)}px`];
        }

        const dashOffset = Math.round(circumference * (1 - this._score));

        return [`${circumference}px`, `${dashOffset}px`];
    }
}
