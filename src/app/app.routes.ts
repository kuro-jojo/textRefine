import { Routes } from '@angular/router';
import { ResultComponent } from './pages/result/result.component';
import { BasicAnalysisComponent } from './pages/basic-analysis/basic-analysis.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';


export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'try',
        component: BasicAnalysisComponent
    },
    {
        path: 'result',
        component: ResultComponent
    }
];
