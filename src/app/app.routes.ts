import { Routes } from '@angular/router';
import { EditorComponent } from './components/editor/editor.component';
import { ResultComponent } from './components/result/result.component';

export const routes: Routes = [
    {
        path: '',
        component: EditorComponent
    },
    {
        path: 'result',
        component: ResultComponent
    }
];
