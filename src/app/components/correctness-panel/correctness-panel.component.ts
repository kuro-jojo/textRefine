import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueDetailComponent } from '../issue-detail/issue-detail.component';
import { Category, TextIssue } from '../../models/issue';
import { CorrectnessResult } from '../../models/evaluation';
import { getCategoryName, getCategorySeverity, getCategorySeverityText } from '../../models/issue';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-correctness-panel',
    standalone: true,
    imports: [
        CommonModule,
        IssueDetailComponent,
        FormsModule
    ],
    templateUrl: './correctness-panel.component.html',
})
export class CorrectnessPanelComponent implements OnChanges {
    @Input() correctnessResult: CorrectnessResult | null = null;
    @Input() text!: string;

    filteredIssues: TextIssue[] = [];
    shownIssues: TextIssue[] = [];
    selectedSeverity: string = '';
    selectedType: string = '';
    sortBy: string = 'location';
    errorCategories = Object.values(Category);
    currentNextWindow: number = 0;
    nextWindowValue: number = 6;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['correctnessResult']) {
            this.correctnessResult = changes['correctnessResult'].currentValue;
            this.updateFilteredIssues();
            this.updateShownIssues();
        }
    }

    resetFilters(): void {
        this.selectedSeverity = '';
        this.selectedType = '';
        this.sortBy = 'location';
        this.updateFilteredIssues();
    }

    updateFilteredIssues(): void {
        if (!this.correctnessResult) return;

        let issues = [...this.correctnessResult.issues];

        // Filter by type
        if (this.selectedType) {
            issues = issues.filter(issue => getCategoryName(issue.category) === this.selectedType);
        }

        // Filter by severity
        if (this.selectedSeverity) {
            issues = issues.filter(issue => getCategorySeverityText(issue) === this.selectedSeverity);
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

    updateShownIssues(): void {
        if (!this.correctnessResult) return;

        this.shownIssues = this.filteredIssues.slice(0, this.currentNextWindow + this.nextWindowValue);
        this.currentNextWindow += this.nextWindowValue;
    }

    getShowMoreText(): string {
        if (!this.correctnessResult) return '';
        if (this.correctnessResult.issues.length <= this.nextWindowValue) {
            return '';
        }
        if (this.correctnessResult.issues.length > this.currentNextWindow) {
            return `and ${this.correctnessResult.issues.length - this.currentNextWindow} more...`;
        }
        return 'show less';
    }

    toggleShowNext(): void {
        if (!this.correctnessResult) return;

        if (this.correctnessResult.issues.length <= this.currentNextWindow) {
            this.currentNextWindow = 0;
        }
        this.updateShownIssues();
    }
}
