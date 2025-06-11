import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CorrectnessPanelComponent } from '../../components/correctness-panel/correctness-panel.component';
import {
    CoherenceResult,
    CorrectnessResult,
    EvaluationRequest,
    EvaluationGlobalScore,
    PrecisionResult,
    SophisticationResult,
    LexicalDiversityResult,
    ReadabilityResult,
    WordFrequencyGroup
} from '../../models/evaluation';
import { Category, ErrorCategory, getCategoryName } from '../../models/issue';
import { EvaluationResultService } from '../../services/evaluation-result.service';
import { EvaluationService } from '../../services/evaluation.service';
import { getScoreColor, DETAIL_OF_CATEGORY } from '../../utils/classes-mapping.utils';
import { LexicalDiversityPanelComponent } from '../../components/lexical-diversity-panel/lexical-diversity-panel.component';
import { OverallScoreComponent } from '../../components/overall-score/overall-score.component';
import { PrecisionPanelComponent } from '../../components/precision-panel/precision-panel.component';
import { ReadabilityPanelComponent } from '../../components/readability-panel/readability-panel.component';
import { ScoreCardComponent } from '../../components/score-card/score-card.component';
import { SophisticationPanelComponent } from '../../components/sophistication-panel/sophistication-panel.component';
import { CoherencePanelComponent } from '../../components/coherence-panel/coherence-panel.component';

interface TextToken {
    text: string;
    category: ErrorCategory | null;
}

@Component({
    imports: [
        CommonModule,
        FormsModule,
        ScoreCardComponent,
        OverallScoreComponent,
        CorrectnessPanelComponent,
        PrecisionPanelComponent,
        SophisticationPanelComponent,
        LexicalDiversityPanelComponent,
        ReadabilityPanelComponent,
        CoherencePanelComponent
    ],
    templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
    evaluationResult: EvaluationGlobalScore | null = null;
    precisionResult: PrecisionResult | null = null;
    correctnessResult: CorrectnessResult | null = null;
    sophisticationResult: SophisticationResult | null = null;
    lexicalDiversityResult: LexicalDiversityResult | null = null;
    readabilityResult: ReadabilityResult | null = null;
    coherenceResult: CoherenceResult | null = null;
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
        'Rare Words': 'bg-teal-100 text-teal-400',
    };
    categories = Object.keys(this.categoryColors);

    tabs = [
        { id: 'coherence', icon: 'compass', title: 'Coherence' },
        { id: 'correctness', icon: 'check', title: 'Correctness' },
        { id: 'sophistication', icon: 'graduation-cap', title: 'Sophistication' },
        { id: 'precision', icon: 'bullseye', title: 'Precision' },
        { id: 'lexical_diversity', icon: 'book', title: 'Lexical Diversity' },
        { id: 'readability', icon: 'glasses', title: 'Readability' }
    ];
    @ViewChild('breakdownContent') breakdownContent: ElementRef | undefined;

    getScoreColor = getScoreColor;

    constructor(
        private evaluationResultService: EvaluationResultService,
        private router: Router,
        private evaluationService: EvaluationService
    ) { }

    demoCall() {
        const text = `<h1>The environment</h1>
        Environmental conservation is vital for maintaining the health of our planet and ensuring a sustainable future for generations to come. As humanfe activities continue to expand, natural ecosystems face unprecedented threats such as deforestation, pollution, climate change, and loss of biodiversity. Protecting our environment requires collective efforts at individual, community, and governmental levels. Simple actions like reducing waste, recycling, conserving water, and using renewable energy sources can significantly reduce our ecological footprint. Governments and organizations play a crucial role by implementing policies that promote sustainable practices, protect endangered species, and restore degraded habitats. Education also plays a key role in raising awareness about environmental issues, encouraging responsible behavior, and fostering a culture of conservation. Additionally, technological advancements offer innovative solutions to environmental challenges, such as renewable energy technologies, eco-friendly transportation, and waste management systems. Ultimately, preserving the environment is not just an ethical obligation but a practical necessity for ensuring a healthy, balanced world. By taking proactive steps today, we can mitigate the adverse effects of environmental degradation and build a resilient future where humans and nature coexist harmoniously. Our collective responsibility is to act now for a greener, more sustainable planet.`;

        const request: EvaluationRequest = {
            text: text,
            topic: 'Environment',
            audience: 'professional'
        };

        this.evaluationService.evaluateText(request).subscribe({
            next: (result) => {
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
            next: (result: EvaluationGlobalScore | null) => {
                if (result) {
                    this.evaluationResult = result;
                    this.filterTabsIfNoIssues();
                    this.precisionResult = result.vocabulary.precision;
                    this.correctnessResult = result.correctness;
                    this.sophisticationResult = result.vocabulary.sophistication;
                    this.lexicalDiversityResult = result.vocabulary.lexical_diversity;
                    this.readabilityResult = result.readability;
                    this.coherenceResult = result.coherence;

                    console.log(result, this.readabilityResult);
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

    selectTab(tabId: string, scroll: boolean = true) {
        if (!this.tabs.find(tab => tab.id === tabId)
            || this.selectedTab === tabId
            || !this.breakdownContent?.nativeElement) return;

        this.selectedTab = tabId;
        if (scroll) this.breakdownContent.nativeElement.scrollIntoView({ behavior: 'smooth' });
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
            case 'coherence':
                return this.getScoreColor(this.evaluationResult.coherence.score);
            case 'correctness':
                return this.getScoreColor(this.evaluationResult.correctness.score);
            case 'precision':
                return this.getScoreColor(this.evaluationResult.vocabulary.precision.score);
            case 'sophistication':
                return this.getScoreColor(this.evaluationResult.vocabulary.sophistication.score);
            case 'lexical_diversity':
                return this.getScoreColor(this.evaluationResult.vocabulary.lexical_diversity.ttr);
            case 'readability':
                return this.getScoreColor(this.evaluationResult.readability.score);
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
