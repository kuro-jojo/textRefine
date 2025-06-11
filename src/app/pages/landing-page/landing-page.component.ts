import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from "../../components/text-editor/text-editor.component";
import { TestimonialComponent, Testimonial } from "../../components/testimonial/testimonial.component";
import { PricingContainerComponent } from "../../components/pricing-container/pricing-container.component";

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, TextEditorComponent, TestimonialComponent, PricingContainerComponent],
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
    testimonials: Testimonial[] = [];
}
