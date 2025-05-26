import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextIssue, ErrorCategory, getCategorySeverityText } from '../../models/issue';
import { Severity, Category } from '../../models/issue';
import { SEVERITY_CLASSES, DETAIL_OF_CATEGORY } from '../../utils';
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
    selector: 'app-issue-detail',
    imports: [CommonModule, TooltipComponent],
    templateUrl: './issue-detail.component.html',
    standalone: true
})
export class IssueDetailComponent {
    @Input() issue!: TextIssue;
    @Input() text!: string ;

    private readonly severityClasses = SEVERITY_CLASSES;

    private readonly categoryDetail = DETAIL_OF_CATEGORY;
    
    getSeverityClass(issue: TextIssue): string {
        const severity = this.getSeverityOrder(issue) as Severity;
        return this.severityClasses[severity] || 'bg-gray-500 text-gray-900';
    }

    getCategoryTextColor(issue: TextIssue): string {
        const category = issue.category[0] as Category;
        return this.categoryDetail[category].text_color || '';
    }

    getCategoryBackgroundColor(issue: TextIssue): string {
        const category = issue.category[0] as Category;
        return this.categoryDetail[category].background_color || '';
    }

    getCategoryBackgroundColorLight(issue: TextIssue): string {
        const category = issue.category[0] as Category;
        return this.categoryDetail[category].background_color_light || '';
    }

    getErrorIcon(issue: TextIssue): string {
        const category = issue.category[0] as Category;
        return this.categoryDetail[category].icon || 'fa-question-circle';
    }

    getCategoryDescription(category: ErrorCategory): string {
        const cat = category[0] as Category;
        return this.categoryDetail[cat].description || 'Unknown category';
    }

    getSeverityOrder(issue: TextIssue): Severity {
        return getCategorySeverityText(issue);
    }

    getIssueText(issue: TextIssue): string {
        const issueWordStart = issue.start_offset;
        const issueWordEnd = issue.start_offset + issue.error_length;
        if (!this.text) return '';
        const issueWord = this.text.substring(issueWordStart, issueWordEnd);
        // Get words before the issue
        let start = issueWordStart;
        let wordsBefore = 0;
        while (start > 0 && wordsBefore < 4) {
            if (this.text[start] === ' ') wordsBefore++;
            start--;
        }

        // Get words after the issue
        let end = issueWordEnd;
        let wordsAfter = 0;
        while (end < this.text.length && wordsAfter < 5) {
            if (this.text[end] === ' ') wordsAfter++;
            end++;
        }

        // Ensure we don't cut off words
        while (start > 0 && this.text[start] !== ' ') start--;
        while (end < this.text.length && this.text[end] !== ' ') end++;

        // If we're at the start of the text, adjust start
        if (start < 0) start = 0;
        // If we're at the end of the text, adjust end
        if (end > this.text.length) end = this.text.length;

        let issueText = this.text.substring(start, end).trim();
        const color = this.getSeverityClass(issue);

        issueText = this.removeHtmlTags(issueText);
        const textWithStyle = issueText.replace(issueWord, `<span class="${color} px-1.5 py-0.5 rounded issue-chip font-semibold text-stone-900">${issueWord}</span>`);
        return textWithStyle;
    }

    removeHtmlTags(text: string): string {
        return text.replace(/<[^>]*>/g, '');
    }
}
