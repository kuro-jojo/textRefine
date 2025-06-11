import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadabilityResult } from '../../models/evaluation';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils/classes-mapping.utils';
import { TooltipComponent } from "../tooltip/tooltip.component";
import { splitIntoSentences } from '../../utils/text.utils';

@Component({
    selector: 'app-readability-panel',
    standalone: true,
    imports: [CommonModule, TooltipComponent],
    templateUrl: './readability-panel.component.html',
})
export class ReadabilityPanelComponent {
    @Input() readabilityResult: ReadabilityResult | null = null;
    @Input() text: string = '';


    getScoreInPercentage = getScoreInPercentage
    getScoreColor = getScoreColor
    getScoreText = getScoreText
    splitIntoSentences = splitIntoSentences

    getEstimatedReadingTime() {
        if (!this.readabilityResult?.estimated_reading_time) return 'N/A';
        const time = this.readabilityResult.estimated_reading_time;
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60);
        if (minutes === 0) return `${seconds} sec`;
        return `${minutes} min ${seconds} sec`;
    }
}
