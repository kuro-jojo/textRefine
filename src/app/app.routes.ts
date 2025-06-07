import { Routes } from '@angular/router';
import { ResultComponent } from './components/result/result.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'result',
        component: ResultComponent
    }
];
