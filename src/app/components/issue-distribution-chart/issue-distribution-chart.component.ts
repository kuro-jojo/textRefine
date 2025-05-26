import { Component, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { Chart, ChartData, registerables } from 'chart.js';
import { TextIssue } from '../../models/issue';

@Component({
    selector: 'app-issue-distribution-chart',
    template: '<canvas id="chartCanvas"></canvas>',
    styles: []
})
export class IssueDistributionChartComponent implements OnChanges, AfterViewInit {
    @Input() issues: TextIssue[] = [];
    chart: Chart | undefined;

    constructor() {
        Chart.register(...registerables);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['issues'] && this.chart) {
            this.updateChart();
        }
    }

    ngAfterViewInit() {
        this.initializeChart();
    }

    private initializeChart(): void {
        const chartCanvas = document.getElementById('chartCanvas');
        if (!chartCanvas) return;

        this.chart = new Chart(chartCanvas as HTMLCanvasElement, {
            type: 'doughnut',
            data: this.getChartData(),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 10,
                            boxWidth: 10
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                return `${label}: ${value}`;
                            }
                        }
                    }
                }
            }
        });
    }

    private updateChart(): void {
        if (this.chart) {
            const data = this.getChartData();
            this.chart.data = data;
            this.chart.update();
        }
    }

    private getChartData(): ChartData {
        const categories = this.categorizeIssues();
        return {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#FFD700', // Gold for Word Usage
                    '#FF69B4', // Hot Pink for Stylistic Issues
                    '#87CEEB', // Sky Blue for Other
                ]
            }]
        };
    }

    private categorizeIssues(): { [key: string]: number } {
        const categories: { [key: string]: number } = {
            'Word Usage': 0,
            'Stylistic Issues': 0,
            'Other': 0
        };

        const wordUsageCategories = ['CONFUSED_WORDS', 'COLLOQUIALISMS', 'REDUNDANCY'] as const;
        const stylisticCategories = ['STYLE', 'REPETITIONS_STYLE', 'REPETITIONS', 'PLAIN_ENGLISH', 'MISC'] as const;

        this.issues.forEach(issue => {
            const categoryStr = issue.rule_issue_type;
            
            // Check for exact matches in word usage categories
            if (wordUsageCategories.includes(categoryStr as typeof wordUsageCategories[number])) {
                categories['Word Usage']++;
            }
            // Check if category string contains any word usage category
            else if (wordUsageCategories.some(category => categoryStr.includes(category))) {
                categories['Word Usage']++;
            }
            // Check for exact matches in stylistic categories
            else if (stylisticCategories.includes(categoryStr as typeof stylisticCategories[number])) {
                categories['Stylistic Issues']++;
            }
            // Check if category string contains any stylistic category
            else if (stylisticCategories.some(category => categoryStr.includes(category))) {
                categories['Stylistic Issues']++;
            }
            // Final check: if category name contains 'Word Usage' or 'Stylistic Issues'
            else if (categoryStr.includes('Word Usage') || categoryStr.includes('Stylistic Issues')) {
                categories[categoryStr.includes('Word Usage') ? 'Word Usage' : 'Stylistic Issues']++;
            }
            else {
                categories['Other']++;
            }
        });

        return categories;
    }
}
