import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { OverallScoreComponent } from '../overall-score/overall-score.component';
import { CorrectnessPanelComponent } from '../correctness-panel/correctness-panel.component';
import { PrecisionPanelComponent } from '../precision-panel/precision-panel.component';
import { CorrectnessResult, EvaluationGlobalScore, PrecisionResult } from '../../models/evaluation';
import { TextIssue, getCategorySeverityText, Category, ErrorCategory, Severity } from '../../models/issue';
import { EvaluationResultService } from '../../services/evaluation-result.service';
import { Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { getCategoryName, getCategorySeverity } from '../../models/issue';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils';
import { SEVERITY_CLASSES } from '../../utils';

@Component({
    selector: 'app-result',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ScoreCardComponent,
        OverallScoreComponent,
        CorrectnessPanelComponent,
        PrecisionPanelComponent
    ],
    templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
    evaluationResult: EvaluationGlobalScore | null = null;
    precisionResult: PrecisionResult | null = null;
    correctnessResult: CorrectnessResult | null = null;
    rawText: string = '';

    // Make Category enum available in template
    Category = Category;
    error: string | null = null;
    Math = Math;

    selectedTab: string = 'correctness';
    selectedSeverity: string = '';
    selectedType: string = '';
    searchKeyword: string = '';
    sortBy: string = 'location';


    tabs = [
        { id: 'correctness', icon: 'check', title: 'Correctness' },
        { id: 'sophistication', icon: 'graduation-cap', title: 'Sophistication' },
        { id: 'precision', icon: 'bullseye', title: 'Precision' },
        { id: 'lexical_diversity', icon: 'book', title: 'Lexical Diversity' },
        // { id: 'readability', icon: 'glasses', title: 'Readability' }
    ];

    constructor(
        private evaluationResultService: EvaluationResultService,
        private router: Router,
        private evaluationService: EvaluationService
    ) { }

    demoCall() {
        const text = `In todday's rapdidly evolving world, adaptability and continuous learning have become essential skills for success. As technology advances at an unprecedented pace, individuals and organizations must stayed informed and flexible to remain competitive. Embracing innovation fosters creativity and opens new opportunities, allowing us to solve complex problems more effectively. Education and skill development are crucial components in this journey, empowering people unto navigation change change confidently. Moreover, cultivating a growth mindset encourages resilience, enabling us to view challenges as chances to grow rather than obstacles. Collaboration and communication are also vital, as working together often leads to more innovative solutions and shared success. Sustainability has gained importance, urging us to adopt eco-friendly practices that protect our planet for future generations. In addition, mental health awareness are rising, highlighting the need to prioritize well-being amidst busy lifestyles. Ultimately, balancing technological progress with ethical considerations ensures that advancements benefit society as a whole. By fostering a culture of curiosity and openness, we can create the less more inclusives and dynamic environment where everyone has the opportunity to thrive. As I we look ahead, embracing change with a plus plus positive attitude will be key to building a resilient and prosperous future for all.`;
        this.evaluationService.evaluateText(text).subscribe({
            next: (result) => {
                console.log(result);
                this.evaluationResultService.setEvaluationResult(result);
                this.evaluationResultService.setRawText(text);
                // this.router.navigate(['/result']);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    ngOnInit() {
        this.demoCall();
        this.evaluationResultService.getEvaluationResult().subscribe({
            next: (result) => {
                if (result) {
                    this.evaluationResult = result;
                    this.filterTabsIfNoIssues();
                    this.precisionResult = result.vocabulary.precision;
                    this.correctnessResult = result.correctness;
                } else {
                    // this.router.navigate(['/']);
                }
            },
            error: (error) => {
                this.error = error;
                console.error(error);
                this.router.navigate(['/']);
            }
        });

        this.evaluationResultService.getRawText().subscribe({
            next: (text) => {
                if (text) {
                    this.rawText = text;
                } else {
                    // this.router.navigate(['/']);
                }
            },
            error: (error) => {
                this.error = error;
                console.error(error);
                this.router.navigate(['/']);
            }
        });
    }

    selectTab(tabId: string) {
        this.selectedTab = tabId;
    }

    filterTabsIfNoIssues(): void {
        if (!this.evaluationResult) return;
        if (this.evaluationResult.correctness.issues.length === 0) {
            this.tabs = this.tabs.filter(tab => tab.id !== 'correctness');
        }
        if (this.evaluationResult.vocabulary.precision.issues.length === 0) {
            this.tabs = this.tabs.filter(tab => tab.id !== 'precision');
        }
    }

    getSeverityClass(issue: TextIssue): string {
        const severity = this.getSeverityOrder(issue) as Severity;
        return SEVERITY_CLASSES[severity] || 'bg-gray-500 text-gray-900';
    }

    getSeverityOrder(issue: TextIssue): Severity {
        return getCategorySeverityText(issue);
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

    getSelectedTabColor(tabId: string): { text: string; bg: string; all: string; } {
        if (!this.evaluationResult) return this.getScoreColor(null);
        if (!this.isSelected(tabId)) return this.getScoreColor(null);
        switch (tabId) {
            case 'correctness':
                return this.getScoreColor(this.evaluationResult.correctness.score);
            case 'precision':
                return this.getScoreColor(this.evaluationResult.vocabulary.precision.score);
            case 'sophistication':
                return this.getScoreColor(this.evaluationResult.vocabulary.sophistication.score);
            case 'lexical_diversity':
                return this.getScoreColor(this.evaluationResult.vocabulary.lexical_diversity.ttr);
            default:
                return this.getScoreColor(null);
        }
    }

    isSelected(tabId: string): boolean {
        return this.selectedTab === tabId;
    }

    getCategoryName(category: ErrorCategory): string {
        return getCategoryName(category);
    }
}
