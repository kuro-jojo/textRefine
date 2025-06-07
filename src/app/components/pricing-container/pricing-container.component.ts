import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    billingPeriod: string;
    description: string;
    features: string[];
    ctaText: string;
    isPopular?: boolean;
}

@Component({
    selector: 'app-pricing-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pricing-container.component.html',
})
export class PricingContainerComponent {
    @Input() currency: string = '€';
    @Input() billingPeriod: string = 'mo';
    @Input() highlightPopular: boolean = true;

    plans: PricingPlan[] = [
        {
            id: 'free-plan',
            name: 'Free',
            price: 0,
            currency: this.currency,
            billingPeriod: this.billingPeriod,
            description: 'Perfect for occasional use',
            features: [
                'Instant text analysis',
                'Basic readability metrics',
                'Limited history (10 texts)',
                'No progression tracking',
                'No advanced insights'
            ],
            ctaText: 'Get Started'
        },
        {
            id: 'pro-plan',
            name: 'Pro',
            price: 5,
            currency: this.currency,
            billingPeriod: this.billingPeriod,
            description: 'For serious writers',
            features: [
                'Everything in Free',
                'Unlimited text analysis',
                'Full progression tracking',
                'Advanced writing insights',
                'Export to PDF/Word'
            ],
            ctaText: 'Choose Pro',
            isPopular: true
        },
        {
            id: 'developer-plan',
            name: 'Developer',
            price: 10,
            currency: this.currency,
            billingPeriod: this.billingPeriod,
            description: 'For developers',
            features: [
                'Everything in Pro',
                'API access',
                'Priority support'
            ],
            ctaText: 'Choose Developer'
        },
        {
            id: 'team-plan',
            name: 'Team',
            price: 10,
            currency: this.currency,
            billingPeriod: this.billingPeriod,
            description: 'For organizations',
            features: [
                'Everything in Developer',
                '5 team members',
                'Team analytics dashboard'
            ],
            ctaText: 'Choose Team'
        }
    ];

    getPlanClasses(plan: PricingPlan): string {
        const baseClasses = 'border rounded-xl overflow-hidden transition h-full';
        const highlightedClasses = this.highlightPopular && plan.isPopular
            ? 'border-2 border-teal-600 shadow-lg relative'
            : 'border-gray-200 hover:shadow-lg';
        return `${baseClasses} ${highlightedClasses}`;
    }

    getCtaClasses(plan: PricingPlan): string {
        const baseClasses = 'block w-full py-3 text-center rounded-lg font-medium transition cursor-pointer';
        return this.highlightPopular && plan.isPopular
            ? `${baseClasses} bg-teal-600 text-white hover:bg-teal-700`
            : `${baseClasses} border border-teal-600 text-teal-600 hover:bg-teal-50`;
    }
}
