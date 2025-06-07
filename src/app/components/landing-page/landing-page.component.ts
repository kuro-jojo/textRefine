import { Component } from '@angular/core';
import { TextEditorComponent } from "../text-editor/text-editor.component";
import { TestimonialComponent } from "../testimonial/testimonial.component";
import { CommonModule } from '@angular/common';
import { PricingContainerComponent } from '../pricing-container/pricing-container.component';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, TextEditorComponent, TestimonialComponent, PricingContainerComponent],
    templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
    testimonials = [
        {
            author: 'Michael Johnson',
            position: 'Content Strategist',
            content: 'TextRefine has transformed my writing process. The detailed analysis helps me identify patterns I wasn\'t aware of and the suggestions are spot-on.',
            avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
            rating: 5
        },
        {
            author: 'Sarah Williams',
            position: 'Technical Writer',
            content: 'The AI-powered suggestions have significantly improved the clarity and conciseness of my technical documentation. Highly recommended!',
            avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
            rating: 5
        },
        {
            author: 'David Chen',
            position: 'Marketing Manager',
            content: 'TextRefine has been a game-changer for our content team. The real-time feedback helps us maintain a consistent brand voice across all channels.',
            avatarUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg',
            rating: 4
        }
    ];
}
