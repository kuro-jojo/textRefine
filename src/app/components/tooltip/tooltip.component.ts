import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    standalone: true,
    templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
    @Input() tooltipText!: string;
    @Input() leftPosition: number = 40;
    @Input() translate: number = 108;
}
