import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoherenceResult } from '../../models/evaluation';

@Component({
    selector: 'app-coherence-panel',
    imports: [CommonModule],
    templateUrl: './coherence-panel.component.html',
})
export class CoherencePanelComponent {
    @Input() coherenceResult: CoherenceResult | null = null;
}
