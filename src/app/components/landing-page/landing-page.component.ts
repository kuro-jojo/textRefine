import { Component } from '@angular/core';
import { TextEditorComponent } from "../text-editor/text-editor.component";
import { TestimonialComponent, Testimonial } from "../testimonial/testimonial.component";
import { CommonModule } from '@angular/common';
import { PricingContainerComponent } from '../pricing-container/pricing-container.component';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, TextEditorComponent, TestimonialComponent, PricingContainerComponent],
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
    testimonials: Testimonial[] = [];
}
