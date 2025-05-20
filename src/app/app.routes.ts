import { Routes } from '@angular/router';
import { ResultComponent } from './components/result/result.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'result',
        component: ResultComponent
    }
];
