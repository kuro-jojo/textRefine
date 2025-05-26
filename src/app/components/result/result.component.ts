import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoreCardComponent } from '../score-card/score-card.component';
import { OverallScoreComponent } from '../overall-score/overall-score.component';
import { CorrectnessPanelComponent } from '../correctness-panel/correctness-panel.component';
import { PrecisionPanelComponent } from '../precision-panel/precision-panel.component';
import { CorrectnessResult, EvaluationGlobalScore, PrecisionResult, WordFrequencyGroup } from '../../models/evaluation';
import { Category, ErrorCategory } from '../../models/issue';
import { EvaluationResultService } from '../../services/evaluation-result.service';
import { Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';
import { getCategoryName } from '../../models/issue';
import { getScoreColor, DETAIL_OF_CATEGORY } from '../../utils';
import { SophisticationPanelComponent } from "../sophistication-panel/sophistication-panel.component";
import { SophisticationResult } from "../../models/evaluation";

interface TextToken {
    text: string;
    category: ErrorCategory | null;
}

@Component({
    selector: 'app-result',
    imports: [
        CommonModule,
        FormsModule,
        ScoreCardComponent,
        OverallScoreComponent,
        CorrectnessPanelComponent,
        PrecisionPanelComponent,
        SophisticationPanelComponent
    ],
    templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
    evaluationResult: EvaluationGlobalScore | null = null;
    precisionResult: PrecisionResult | null = null;
    correctnessResult: CorrectnessResult | null = null;
    sophisticationResult: SophisticationResult | null = null;
    editorContent: string = '';
    highlightedText: string = '';

    // Make Category enum available in template
    Category = Category;
    error: string | null = null;
    Math = Math;

    selectedTab: string = 'correctness';
    selectedSeverity: string = '';
    selectedType: string = '';
    searchKeyword: string = '';
    sortBy: string = 'location';

    categoryColors: { [key: string]: string } = {
        'Spelling & Typos': `${DETAIL_OF_CATEGORY['Spelling & Typos'].background_color} ${DETAIL_OF_CATEGORY['Spelling & Typos'].text_color}`,
        'Grammar Rules': `${DETAIL_OF_CATEGORY['Grammar Rules'].background_color} ${DETAIL_OF_CATEGORY['Grammar Rules'].text_color}`,
        'Mechanics': `${DETAIL_OF_CATEGORY['Mechanics'].background_color} ${DETAIL_OF_CATEGORY['Mechanics'].text_color}`,
        'Word Usage': `${DETAIL_OF_CATEGORY['Word Usage'].background_color} ${DETAIL_OF_CATEGORY['Word Usage'].text_color}`,
        'Meaning & Logic': `${DETAIL_OF_CATEGORY['Meaning & Logic'].background_color} ${DETAIL_OF_CATEGORY['Meaning & Logic'].text_color}`,
        'Stylistic Issues': `${DETAIL_OF_CATEGORY['Stylistic Issues'].background_color} ${DETAIL_OF_CATEGORY['Stylistic Issues'].text_color}`,
        'Rare Words': 'bg-teal-200 text-teal-400',
    };
    categories = Object.keys(this.categoryColors);

    tabs = [
        { id: 'correctness', icon: 'check', title: 'Correctness' },
        { id: 'sophistication', icon: 'graduation-cap', title: 'Sophistication' },
        { id: 'precision', icon: 'bullseye', title: 'Precision' },
        { id: 'lexical_diversity', icon: 'book', title: 'Lexical Diversity' },
        // { id: 'readability', icon: 'glasses', title: 'Readability' }
    ];

    getScoreColor = getScoreColor;

    constructor(
        private evaluationResultService: EvaluationResultService,
        private router: Router,
        private evaluationService: EvaluationService
    ) { }

    demoCall() {
        const text = `<h1>A titledr for the text</h1>
In todday's rapdidly evolving world, adaptability and continuous learning have become essential skills for success. As technology advances at an unprecedented pace, individuals and organizations must stayed informed and flexible to remain competitive. Embracing innovation fosters creativity and opens new opportunities, allowing us to solve complex problems more effectively. Education and skill development are crucial components in this journey, empowering people unto navigation change change confidently. Moreover, cultivating a growth mindset encourages resilience, enabling us to view challenges as chances to grow rather than obstacles. Collaboration and communication are also vital, as working together often leads to more innovative solutions and shared success. Sustainability has gained importance, urging us to adopt eco-friendly practices that protect our planet for future generations. In addition, mental health awareness are rising, highlighting the need to prioritize well-being amidst busy lifestyles. Ultimately, balancing technological progress with ethical considerations ensures that advancements benefit society as a whole. By fostering a culture of curiosity and openness, we can create the less more inclusives and dynamic environment where everyone has the opportunity to thrive. As I we look ahead, embracing change with a plus plus positive attitude will be key to building a resilient and prosperous future for all.`;

        this.evaluationService.evaluateText(text).subscribe({
            next: (result) => {
                console.log(result);
                this.evaluationResultService.setEvaluationResult(result);
                this.evaluationResultService.setEditorContent(text);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    ngOnInit() {
        // this.demoCall();
        this.evaluationResultService.getEvaluationResult().subscribe({
            next: (result) => {
                if (result) {
                    this.evaluationResult = result;
                    this.filterTabsIfNoIssues();
                    this.precisionResult = result.vocabulary.precision;
                    this.correctnessResult = result.correctness;
                    this.sophisticationResult = result.vocabulary.sophistication;
                } else {
                    this.router.navigate(['/']);
                }
            },
            error: (error) => {
                this.error = error;
                console.error(error);
                this.router.navigate(['/']);
            }
        });

        this.evaluationResultService.getEditorInfo().subscribe({
            next: (info) => {
                if (info) {
                    this.editorContent = info;
                    this.highlightedText = this.highlightText(this.editorContent);
                } else {
                    this.router.navigate(['/']);
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

    isTabSelected(tabId: string): boolean {
        return this.selectedTab === tabId;
    }

    filterTabsIfNoIssues(): void {
        if (!this.evaluationResult) return;
        if (this.evaluationResult.correctness.issues.length === 0) {
            this.tabs = this.tabs.filter(tab => tab.id !== 'correctness');
        }
        if (this.evaluationResult.vocabulary.precision.issues.length === 0) {
            this.tabs = this.tabs.filter(tab => tab.id !== 'precision');
        }

        this.selectedTab = this.tabs[0].id;
    }

    getSelectedTabColor(tabId: string): { text: string; bg: string; all: string; } {
        if (!this.evaluationResult) return this.getScoreColor(null);
        if (!this.isTabSelected(tabId)) return this.getScoreColor(null);
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

    highlightText(text: string): string {
        if (!this.evaluationResult) return text;

        const tokenizedText = this.getHighlightedIssues(text);

        // Get all issues from correctness and precision results

        let highlightedText = "";

        for (let index = 0; index < tokenizedText.length; index++) {
            if (index % 2 == 0) {
                highlightedText += tokenizedText[index].text
                continue
            }
            const token = tokenizedText[index];
            if (token.category) {
                const categoryName = getCategoryName(token.category!);
                const colorClass = this.categoryColors[categoryName] || 'bg-gray-100 text-gray-800';
                const highlightedPart = `<span class="inline-block rounded px-1 ${colorClass}">${token.text}</span>`;
                highlightedText += highlightedPart
            }
        }

        const rareWords = this.getHighlightedRareWords(text);
        rareWords.forEach((word: TextToken) => {
            const colorClass = this.categoryColors['Rare Words'] || 'bg-gray-100 text-gray-800';
            const highlightedPart = `<span class="inline-block rounded px-1 ${colorClass}">${word.text}</span>`;
            highlightedText = highlightedText.replace(word.text, highlightedPart)
        });

        return highlightedText;
    }

    getHighlightedRareWords(text: string): TextToken[] {
        if (!this.evaluationResult) return []
        const rareWords = this.evaluationResult.vocabulary.sophistication.breakdown.find(b => b.group === WordFrequencyGroup.RARE)?.words;

        return rareWords?.map(word => ({ text: word, category: null })) || [];
    }

    getHighlightedIssues(text: string): TextToken[] {
        if (!this.evaluationResult) return []

        // Get sorted issues
        const sortedIssues = [...this.evaluationResult.correctness.issues]
            .sort((a, b) => a.start_offset - b.start_offset);

        let i = 0;
        const tokenizedText: TextToken[] = [];
        for (const issue of sortedIssues) {
            const start = issue.start_offset;
            const end = start + issue.error_length;

            // Before adding a new token, check for overlaps
            // Thus only going to show one issue per "window"
            if (i < start) {
                tokenizedText.push({ text: text.slice(i, start), category: null });
            }
            tokenizedText.push({ text: text.slice(start, end), category: issue.category });
            i = end;
        }
        if (i < text.length) {
            tokenizedText.push({ text: text.slice(i), category: null })
        }
        return tokenizedText;
    }
}
