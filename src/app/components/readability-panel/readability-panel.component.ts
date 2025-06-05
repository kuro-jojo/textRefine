import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadabilityResult } from '../../models/evaluation';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils';
import { TooltipComponent } from "../tooltip/tooltip.component";

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

    getEstimatedReadingTime() {
        if (!this.readabilityResult?.estimated_reading_time) return 'N/A';
        const time = this.readabilityResult.estimated_reading_time;
        const seconds = Math.floor(time % 60);
        const minutes = Math.floor(time / 60);
        if (minutes === 0) return `${seconds} sec`;
        return `${minutes} min ${seconds} sec`;
    }
}
