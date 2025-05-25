import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    imports: [],
    templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
    @Input() tooltipText!: string;
}
