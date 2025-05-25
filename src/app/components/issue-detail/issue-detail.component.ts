import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextIssue, ErrorCategory, getCategorySeverityText } from '../../models/issue';
import { Severity, Category } from '../../models/issue';
import { SEVERITY_CLASSES } from '../../utils';
import { TooltipComponent } from "../tooltip/tooltip.component";

type CategoryDetail = {
    text_color: string;
    background_color: string;
    background_color_light: string;
    icon: string;
    description: string;
}

@Component({
    selector: 'app-issue-detail',
    imports: [CommonModule, TooltipComponent],
    templateUrl: './issue-detail.component.html',
    standalone: true
})
export class IssueDetailComponent {
    @Input() issue!: TextIssue;
    @Input() rawText!: string;

    private readonly severityClasses = SEVERITY_CLASSES;

    private readonly categoryDetail: Record<Category, CategoryDetail> = {
        'Spelling & Typos': {
            text_color: 'text-red-400',
            background_color: 'bg-red-200',
            background_color_light: 'bg-red-50',
            icon: 'fa-pen',
            description: 'Spelling errors, typos, and incorrect word usage'
        },
        'Grammar Rules': {
            text_color: 'text-teal-400',
            background_color: 'bg-teal-200',
            background_color_light: 'bg-teal-50',
            icon: 'fa-spell-check',
            description: 'Grammar errors, tense consistency, subject-verb agreement, and sentence structure'
        },
        'Mechanics': {
            text_color: 'text-blue-400',
            background_color: 'bg-blue-200',
            background_color_light: 'bg-blue-50',
            icon: 'fa-comma',
            description: 'Punctuation errors, capitalization, hyphenation, and formatting'
        },
        'Word Usage': {
            text_color: 'text-purple-400',
            background_color: 'bg-purple-200',
            background_color_light: 'bg-purple-50',
            icon: 'fa-code',
            description: 'Inconsistent or incorrect word usage, including verb tense, verb forms, and synonyms'
        },
        'Meaning & Logic': {
            text_color: 'text-green-400',
            background_color: 'bg-green-200',
            background_color_light: 'bg-green-50',
            icon: 'fa-paint-brush',
            description: 'Sentences with unclear or ambiguous meaning, logical errors, or lack of clarity'
        },
        'Stylistic Issues': {
            text_color: 'text-fuchsia-400',
            background_color: 'bg-fuchsia-200',
            background_color_light: 'bg-fuchsia-50',
            icon: 'fa-paint-brush',
            description: 'Writing style issues, including sentence structure, voice, tone, and clarity'
        }
    } as const;

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
        const issueWord = this.rawText.substring(issueWordStart, issueWordEnd);
        // Get words before the issue
        let start = issueWordStart;
        let wordsBefore = 0;
        while (start > 0 && wordsBefore < 4) {
            if (this.rawText[start] === ' ') wordsBefore++;
            start--;
        }

        // Get words after the issue
        let end = issueWordEnd;
        let wordsAfter = 0;
        while (end < this.rawText.length && wordsAfter < 5) {
            if (this.rawText[end] === ' ') wordsAfter++;
            end++;
        }

        // Ensure we don't cut off words
        while (start > 0 && this.rawText[start] !== ' ') start--;
        while (end < this.rawText.length && this.rawText[end] !== ' ') end++;

        // If we're at the start of the text, adjust start
        if (start < 0) start = 0;
        // If we're at the end of the text, adjust end
        if (end > this.rawText.length) end = this.rawText.length;

        const issueText = this.rawText.substring(start, end).trim();
        const color = this.getSeverityClass(issue);
        const textWithStyle = issueText.replace(issueWord, `<span class="${color} px-1.5 py-0.5 rounded issue-chip font-semibold text-stone-900">${issueWord}</span>`);
        return textWithStyle;
    }
}
