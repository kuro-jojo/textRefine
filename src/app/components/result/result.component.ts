import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { OverallScoreComponent } from '../overall-score/overall-score.component';
import { EvaluationGlobalScore } from '../../models/evaluation';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils';
import { EvaluationResultService } from '../../services/evaluation-result.service';

@Component({
    selector: 'app-result',
    imports: [CommonModule, ScoreCardComponent, OverallScoreComponent],
    templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
    evaluationResult: EvaluationGlobalScore | null = null;
    rawText: string = '';
    error: string | null = null;
    Math = Math;

    constructor(
        private evaluationResultService: EvaluationResultService
    ) { }

    ngOnInit() {
        this.evaluationResultService.getEvaluationResult().subscribe(result => {
            if (result) {
                this.evaluationResult = result;
            }
        });

        this.evaluationResultService.getRawText().subscribe(text => {
            this.rawText = text;
        });
    }

    getScoreColor(score: number | null | undefined): { text: string; bg: string; all: string; } {
        return getScoreColor(score);
    }

    getScoreText(score: number | null | undefined): string {
        return getScoreText(score);
    }

    getScoreInPercentage(score: number | null | undefined): string {
        return getScoreInPercentage(score);
    }
}
