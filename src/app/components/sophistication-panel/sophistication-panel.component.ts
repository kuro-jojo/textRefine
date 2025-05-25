import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SophisticationResult, SophisticationLevel } from "../../models/evaluation";
import { getScoreColor, getScoreInPercentage, getScoreText } from "../../utils";

@Component({
    selector: 'app-sophistication-panel',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './sophistication-panel.component.html',
})
export class SophisticationPanelComponent implements OnChanges {
    @Input() sophisticationResult: SophisticationResult | null = null;
    @Input() rawText: string = '';

    wordGroups: { [key: string]: { words: string[], showAll: boolean } } = {
        common: { words: [], showAll: false },
        mid: { words: [], showAll: false },
        rare: { words: [], showAll: false },
        unknown: { words: [], showAll: false }
    };

    getScoreColor = getScoreColor;
    getScoreInPercentage = getScoreInPercentage;
    getScoreText = getScoreText;

    colors = {
        common: ['bg-blue-200', 'text-blue-700'],
        mid: ['bg-fuchsia-200', 'text-fuchsia-700'],
        rare: ['bg-emerald-200', 'text-emerald-700'],
        unknown: ['bg-gray-200', 'text-gray-700']
    }
    

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes['sophisticationResult']) {
            const currentValue = changes['sophisticationResult'].currentValue;
            if (currentValue) {
                this.sophisticationResult = currentValue;
                this.updateWordGroups();
            }
        }
    }

    private updateWordGroups(): void {
        if (!this.sophisticationResult?.breakdown) return;

        this.sophisticationResult.breakdown.forEach(breakdown => {
            const groupKey = breakdown.group.toLocaleLowerCase();
            console.log(this.wordGroups[groupKey]);
            if (this.wordGroups[groupKey]) {
                this.wordGroups[groupKey].words = breakdown.words;
            }
        });
    }

    getShownWords(group: keyof typeof this.wordGroups): string[] {
        const wordGroup = this.wordGroups[group];
        if (!wordGroup) return [];
        
        if (!wordGroup.showAll) {
            return wordGroup.words.slice(0, 10);
        }
        return wordGroup.words;
    }

    getShowMoreText(group: keyof typeof this.wordGroups): string {
        const wordGroup = this.wordGroups[group];
        if (!wordGroup || wordGroup.words.length <= 10) {
            return '';
        }
        if (wordGroup.showAll) {
            return 'show less';
        }
        return `and ${wordGroup.words.length - 10} more...`;
    }

    toggleShowAll(group: keyof typeof this.wordGroups): void {
        if (this.wordGroups[group]) {
            this.wordGroups[group].showAll = !this.wordGroups[group].showAll;
        }
    }

    // Calculate percentage of a count relative to total
    getPercentage(count: number | undefined, total: number | undefined): number {
        if (!count || !total || total === 0) {
            return 0;
        }
        return (count / total) * 100;
    }


    get sophisticationFeedback(): { iconClass: string; message: string; color: string } | null {
        if (!this.sophisticationResult?.level) {
            return null;
        }

        const sophisticationLevel = this.sophisticationResult.level;
        let iconClass = '';
        const color = getScoreColor(this.sophisticationResult.score).text;
        let message = '';

        switch (sophisticationLevel) {
            case SophisticationLevel.BASIC:
                iconClass = 'fa-exclamation-triangle';
                message = 'Your vocabulary usage is at a basic level. The text relies heavily on very common words, which may limit depth and nuance. Consider using more precise or varied language to better convey complex ideas and elevate your writing.';
                break;
            case SophisticationLevel.CONVERSATIONAL:
                iconClass = 'fa-info-circle';
                message = 'Your vocabulary is at a conversational level. While your word choice is accessible and clear, it lacks the sophistication needed for formal or academic writing. Expanding your vocabulary with mid- to high-frequency academic terms can improve tone and clarity.';
                break;
            case SophisticationLevel.ACADEMIC:
                iconClass = 'fa-check-circle';
                message = 'Your vocabulary reflects an academic level. The language shows diversity and a thoughtful selection of mid- and high-frequency terms. This contributes to a more precise, professional tone suitable for structured writing such as essays or reports.';
                break;
            case SophisticationLevel.ADVANCED:
                iconClass = 'fa-check-circle';
                message = 'Your vocabulary is at an advanced level. The text demonstrates a strong command of complex and domain-relevant language. Your word choice enhances clarity, persuasiveness, and intellectual tone, suitable for high-level academic or technical writing.';
                break;
            case SophisticationLevel.ERUDITE:
                iconClass = 'fa-star';
                message = 'Your vocabulary is at an erudite level. You exhibit exceptional linguistic sophistication, using precise, rare, or field-specific terms with fluency. This level of vocabulary is characteristic of scholarly or expert-level discourse, demonstrating mastery and nuance.';
                break;
        }

        return {
            iconClass: `${color} fa-solid ${iconClass}`,
            message,
            color
        };
    }
}