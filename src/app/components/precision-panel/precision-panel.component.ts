import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueDetailComponent } from '../issue-detail/issue-detail.component';
import { PrecisionResult } from '../../models/evaluation';
import { TextIssue } from '../../models/issue';
import { getScoreColor, getScoreInPercentage } from '../../utils';
import { IssueDistributionChartComponent } from "../issue-distribution-chart/issue-distribution-chart.component";
import { Category } from '../../models/issue';
import { getCategoryName } from '../../models/issue';
import { TooltipComponent } from "../tooltip/tooltip.component";

@Component({
    selector: 'app-precision-panel',
    imports: [
    CommonModule,
    IssueDetailComponent,
    IssueDistributionChartComponent,
    TooltipComponent
],
    templateUrl: './precision-panel.component.html'
})
export class PrecisionPanelComponent {
    @Input() precisionResult: PrecisionResult | null = null;
    @Input() rawText: string = '';

    getScoreColor = getScoreColor;
    getScoreInPercentage = getScoreInPercentage;
    Category = Category;

    // Get issues for a specific category
    getIssuesByCategory(category: Category): TextIssue[] {
        if (!this.precisionResult?.issues) return [];
        return this.precisionResult.issues.filter(issue => {
            const issueCategory = getCategoryName(issue.category);
            return issueCategory === category;
        });
    }
}
