import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { OverallScoreComponent } from '../overall-score/overall-score.component';
import { IssueDetailComponent } from '../issue-detail/issue-detail.component';
import { EvaluationGlobalScore } from '../../models/evaluation';
import { TextIssue, getCategorySeverityText } from '../../models/issue';
import { EvaluationResultService } from '../../services/evaluation-result.service';
import { Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { Category } from '../../models/issue';
import { getCategoryName, getCategorySeverity } from '../../models/issue';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils';

@Component({
    selector: 'app-result',
    imports: [CommonModule, FormsModule, ScoreCardComponent, OverallScoreComponent, IssueDetailComponent],
    templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
    evaluationResult: EvaluationGlobalScore | null = null;
    rawText: string = '';
    error: string | null = null;
    Math = Math;

    selectedTab: string = 'correctness';
    selectedSeverity: string = '';
    selectedType: string = '';
    errorCategories = Object.values(Category);
    searchKeyword: string = '';
    sortBy: string = 'location';
    filteredIssues: TextIssue[] = [];

    // Error categories and their icons
    ;

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
        const text = `In todday's rapdidly evolving world, adaptability and continuous learning have become essential skills for success. As technology advances at an unprecedented pace, individuals and organizations must stayed informed and flexible to remain competitive. Embracing innovation fosters creativity and opens new opportunities, allowing us to solve complex problems more effectively. Education and skill development are crucial components in this journey, empowering people unto navigation change change confidently. Moreover, cultivating a growth mindset encourages resilience, enabling us to view challenges as chances to grow rather than obstacles. Collaboration and communication are also vital, as working together often leads to more innovative solutions and shared success. Sustainability has gained importance, urging us to adopt eco-friendly practices that protect our planet for future generations. In addition, mental health awareness is rising, highlighting the need to prioritize well-being amidst busy lifestyles. Ultimately, balancing technological progress with ethical considerations ensures that advancements benefit society as a whole. By fostering a culture of curiosity and openness, we can create a more inclusive and dynamic environment where everyone has the opportunity to thrive. As we look ahead, embracing change with a positive attitude will be key to building a resilient and prosperous future for all.`;
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
                    this.updateFilteredIssues();
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

    applyFilters(): void {
        // Implement filtering logic based on selected values
        this.updateFilteredIssues();
    }

    updateFilteredIssues(): void {
        if (!this.evaluationResult) return;

        let issues = [...this.evaluationResult.correctness.issues];

        // Filter by type
        if (this.selectedType) {
            issues = issues.filter(issue => getCategoryName(issue.category) === this.selectedType);
        }

        // Filter by severity
        if (this.selectedSeverity) {
            issues = issues.filter(issue => getCategorySeverityText(issue) === this.selectedSeverity);
        }

        // Filter by keyword
        if (this.searchKeyword) {
            issues = issues.filter(issue => {
                const category = getCategoryName(issue.category);
                return issue.message.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                    category.toLowerCase().includes(this.searchKeyword.toLowerCase());
            });
        }

        // Sort issues
        switch (this.sortBy) {
            case 'location':
                issues.sort((a, b) => a.start_offset - b.start_offset);
                break;
            case 'severity':
                issues.sort((a, b) => {
                    return getCategorySeverity(b.category) - getCategorySeverity(a.category);
                });
                break;
            case 'category':
                issues.sort((a, b) => {
                    return - getCategoryName(b.category).localeCompare(getCategoryName(a.category));
                });
                break;
        }

        this.filteredIssues = issues;
    }

    resetFilters(): void {
        this.selectedSeverity = '';
        this.selectedType = '';
        this.searchKeyword = '';
        this.sortBy = 'location';
        this.updateFilteredIssues();
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
}
