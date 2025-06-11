import { Component, Input } from '@angular/core';
import { LexicalDiversityResult } from '../../models/evaluation';
import { getScoreColor, getScoreInPercentage, getScoreText } from '../../utils/classes-mapping.utils';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
    selector: 'app-lexical-diversity-panel',
    imports: [CommonModule, TooltipComponent],
    templateUrl: './lexical-diversity-panel.component.html',
})
export class LexicalDiversityPanelComponent {
    @Input() lexicalDiversityResult: LexicalDiversityResult | null = null;
    @Input() text: string = '';

    getScoreInPercentage = getScoreInPercentage
    getScoreColor = getScoreColor
    getScoreText = getScoreText
}
