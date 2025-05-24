import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextIssue, ErrorCategory, getCategorySeverity } from '../../models/evaluation';

type Severity = 'Major' | 'Medium' | 'Minor';
type Category =
    | 'Spelling & Typos'
    | 'Grammar Rules'
    | 'Mechanics'
    | 'Word Usage'
    | 'Meaning & Logic'
    | 'Stylistic Issues';

type SeverityClasses = {
    readonly [K in Severity]: string;
};

type CategoryDetail = {
    text_color: string;
    icon: string;
    description: string;
}

@Component({
    selector: 'app-issue-detail',
    imports: [CommonModule],
    templateUrl: './issue-detail.component.html',
    standalone: true
})
export class IssueDetailComponent {
    @Input() issue!: TextIssue;
    @Input() rawText!: string;

    private readonly severityClasses: SeverityClasses = {
        Major: 'bg-red-200 text-red-400',
        Medium: 'bg-orange-200 text-orange-400',
        Minor: 'bg-indigo-200 text-indigo-400',
    } as const;

    private readonly categoryDetail: Record<Category, CategoryDetail> = {
        'Spelling & Typos': {
            text_color: 'text-red-400',
            icon: 'fa-pen',
            description: 'Spelling errors, typos, and incorrect word usage'
        },
        'Grammar Rules': {
            text_color: 'text-yellow-400',
            icon: 'fa-spell-check',
            description: 'Grammar errors, tense consistency, subject-verb agreement, and sentence structure'
        },
        'Mechanics': {
            text_color: 'text-blue-400',
            icon: 'fa-comma',
            description: 'Punctuation errors, capitalization, hyphenation, and formatting'
        },
        'Word Usage': {
            text_color: 'text-purple-400',
            icon: 'fa-code',
            description: 'Inconsistent or incorrect word usage, including verb tense, verb forms, and synonyms'
        },
        'Meaning & Logic': {
            text_color: 'text-green-400',
            icon: 'fa-paint-brush',
            description: 'Sentences with unclear or ambiguous meaning, logical errors, or lack of clarity'
        },
        'Stylistic Issues': {
            text_color: 'text-gray-400',
            icon: 'fa-question-circle',
            description: 'Writing style issues, including sentence structure, voice, tone, and clarity'
        }
    } as const;

    getSeverityClass(issue: TextIssue): string {
        const severity = this.getSeverityOrder(issue) as Severity;
        return this.severityClasses[severity] || 'bg-gray-500 text-gray-900';
    }

    getCategoryClass(issue: TextIssue): string {
        const category = issue.category[0] as Category;
        return this.categoryDetail[category].text_color || '';
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
        const severity = getCategorySeverity(issue.category);
        if (severity <= 2) return 'Minor';
        if (severity <= 3) return 'Medium';
        return 'Major';
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
