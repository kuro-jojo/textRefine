import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-testimonial',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './testimonial.component.html',
})
export class TestimonialComponent {
    @Input() testimonial: Testimonial = {} as Testimonial;
}

export interface Testimonial {
    author: string;
    position: string;
    content: string;
    avatarUrl: string;
    rating: number;
}
