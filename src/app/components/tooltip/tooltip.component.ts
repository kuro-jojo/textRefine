import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tooltip',
    standalone: true,
    templateUrl: './tooltip.component.html',
})
export class TooltipComponent {
    @Input() tooltipText!: string;
    @Input() translate: string = '48';
}
