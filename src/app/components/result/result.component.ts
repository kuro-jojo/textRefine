import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { OverallScoreComponent } from '../overall-score/overall-score.component';
import { IssueDetailComponent } from '../issue-detail/issue-detail.component';
import { EvaluationGlobalScore, TextIssue, errorCategoryDisplayNames, ErrorCategory, getCategoryName, getCategorySeverity } from '../../models/evaluation';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils';
import { EvaluationResultService } from '../../services/evaluation-result.service';
import { Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';

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
    errorTypes: {
        label: string;
        icon: string;
        count: number;
        color: string;
        bg_color: string;
    }[] = [
            { label: 'Spelling & Typos', icon: 'pen', count: 0, color: 'text-red-600', bg_color: 'bg-red-100' },
            { label: 'Grammar Rules', icon: 'spell-check', count: 0, color: 'text-yellow-600', bg_color: 'bg-yellow-100' },
            { label: 'Mechanics', icon: 'comma', count: 0, color: 'text-blue-600', bg_color: 'bg-blue-100' },
            { label: 'Word Usage', icon: 'code', count: 0, color: 'text-purple-600', bg_color: 'bg-purple-100' },
            { label: 'Meaning & Logic', icon: 'paint-brush', count: 0, color: 'text-green-600', bg_color: 'bg-green-100' },
            { label: 'Stylistic Issues', icon: 'question-circle', count: 0, color: 'text-gray-600', bg_color: 'bg-gray-100' }
        ];

    categoriesClasses: { [key: string]: string } = {
        'Spelling & Typos': 'text-red-400',
        'Grammar Rules': 'text-yellow-400',
        'Mechanics': 'text-blue-400',
        'Word Usage': 'text-purple-400',
        'Meaning & Logic': 'text-green-400',
        'Stylistic Issues': 'text-gray-400'
    };

    severityClasses: { [key: string]: string } = {
        'Major': 'bg-red-200 text-red-400',
        'Medium': 'bg-orange-200 text-orange-400',
        'Minor': 'bg-indigo-200 text-indigo-400',
    };

    selectedTab: string = 'correctness';
    selectedSeverity: string = '';
    selectedType: string = '';
    errorCategories: [string, number][] = [
        ['Spelling & Typos', 2],
        ['Grammar Rules', 2],
        ['Mechanics', 2],
        ['Word Usage', 2],
        ['Meaning & Logic', 2],
        ['Stylistic Issues', 2],
        ['Contextual Style', 2]
    ];
    errorCategoryDisplayNames = errorCategoryDisplayNames;
    searchKeyword: string = '';
    sortBy: string = 'location';
    filteredIssues: TextIssue[] = [];

    // Error categories and their icons
    errorIcons: { [key: string]: string } = {
        'Spelling & Typos': 'fa-spell-check',
        'Grammar Rules': 'fa-pen',
        'Mechanics': 'fa-cog',
        'Word Usage': 'fa-font',
        'Meaning & Logic': 'fa-brain',
        'Stylistic Issues': 'fa-pen-fancy',
        'Contextual Style': 'fa-paint-brush'
    };

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
        const text = `In todday's rapdidly evolving world, adaptability and continuous learning have become essential skills for success. As technology advances at an unprecedented pace, individuals and organizations must stayed informed and flexible to remain competitive. Embracing innovation fosters creativity and opens new opportunities, allowing us to solve complex problems more effectively. Education and skill development are crucial components in this journey, empowering people to navigate change confidently. Moreover, cultivating a growth mindset encourages resilience, enabling us to view challenges as chances to grow rather than obstacles. Collaboration and communication are also vital, as working together often leads to more innovative solutions and shared success. Sustainability has gained importance, urging us to adopt eco-friendly practices that protect our planet for future generations. In addition, mental health awareness is rising, highlighting the need to prioritize well-being amidst busy lifestyles. Ultimately, balancing technological progress with ethical considerations ensures that advancements benefit society as a whole. By fostering a culture of curiosity and openness, we can create a more inclusive and dynamic environment where everyone has the opportunity to thrive. As we look ahead, embracing change with a positive attitude will be key to building a resilient and prosperous future for all.`;
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

    filterTabsIfNoIssues():void {
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
            issues = issues.filter(issue => {
                const category = getCategoryName(issue.category);
                return category.toLowerCase().includes(this.selectedSeverity.toLowerCase());
            });
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
        }

        this.filteredIssues = issues;
    }

    getSeverityOrder(severity: number): string {
        if (severity <= 2) return 'Minor';
        if (severity <= 3) return 'Medium';
        return 'Major';
    }

    getSeverityClass(issue: TextIssue): string {
        const severity = this.getSeverityOrder(getCategorySeverity(issue.category));
        return this.severityClasses[severity] || 'bg-gray-500 text-gray-900';
    }

    getCategoryClass(issue: TextIssue): string {
        const category = getCategoryName(issue.category);
        return this.categoriesClasses[category] || 'bg-gray-500 text-gray-900';
    }

    getErrorIcon(issue: TextIssue): string {
        return this.errorIcons[getCategoryName(issue.category)] || 'fa-question-circle';
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

    updateErrorCounts() {
        if (!this.evaluationResult?.correctness?.issues) return;

        // Reset counts
        this.errorTypes.forEach(type => type.count = 0);

        // Count issues by type
        this.evaluationResult.correctness.issues.forEach(issue => {
            const category = getCategoryName(issue.category);
            if (category.includes('grammar')) {
                this.errorTypes[0].count++;
            } else if (category.includes('spelling') || category.includes('typing')) {
                this.errorTypes[1].count++;
            } else if (category.includes('style')) {
                this.errorTypes[4].count++;
            } else {
                this.errorTypes[5].count++;
            }
        });
    }

    getCategoryDescription(category: ErrorCategory): string {
        const descriptions: { [key: string]: string } = {
            'Spelling & Typos': 'Spelling or typing error detected',
            'Grammar Rules': 'Grammar rule violation',
            'Mechanics': 'Stylistic inconsistency',
            'Word Usage': 'Inappropriate word usage',
            'Meaning & Logic': 'Stylistic issues present',
            'Stylistic Issues': 'Stylistic issues present',
            'Contextual Style': 'Stylistic issues present'
        };
        return descriptions[getCategoryName(category)] || 'Unknown issue type';
    }

    

    getIssueSeverityBadgeClass(category: ErrorCategory): string {
        const classes: { [key: string]: string } = {
            SPELLING_TYPING: 'bg-yellow-100 text-yellow-800',
            GRAMMAR_RULES: 'bg-red-100 text-red-800',
            MECHANICS: 'bg-blue-100 text-blue-800',
            WORD_USAGE: 'bg-purple-100 text-purple-800',
            MEANING_LOGIC: 'bg-green-100 text-green-800',
            STYLISTIC_ISSUES: 'bg-green-100 text-green-800',
            CONTEXTUAL_STYLE: 'bg-green-100 text-green-800'
        };
        return classes[getCategoryName(category)] || 'bg-gray-100 text-gray-800';
    }

    getIssueTooltip(category: ErrorCategory): string {
        const tooltips: { [key: string]: string } = {
            SPELLING_TYPING: 'Typographical errors or incorrect spelling',
            GRAMMAR_RULES: 'Violations of grammatical rules',
            MECHANICS: 'Inconsistencies in writing style',
            WORD_USAGE: 'Inappropriate or incorrect word choices',
            MEANING_LOGIC: 'Issues related to text style and formatting',
            STYLISTIC_ISSUES: 'Issues related to text style and formatting',
            CONTEXTUAL_STYLE: 'Issues related to text style and formatting'
        };
        return tooltips[getCategoryName(category)] || 'Unknown issue type';
    }

    isSelected(tabId: string): boolean {
        return this.selectedTab === tabId;
    }
}
