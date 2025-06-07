import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-testimonial',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './testimonial.component.html',
})
export class TestimonialComponent {
    @Input() author: string = '';
    @Input() position: string = '';
    @Input() content: string = '';
    @Input() avatarUrl: string = '';
    @Input() rating: number = 5;
}
