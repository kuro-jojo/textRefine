import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EvaluationGlobalScore } from '../models/evaluation';

@Injectable({
    providedIn: 'root'
})
export class EvaluationResultService {
    private _evaluationResult = new BehaviorSubject<EvaluationGlobalScore | null>(null);
    private _editorInfo = new BehaviorSubject<string | null>(null);

    constructor() { }

    setEvaluationResult(result: EvaluationGlobalScore): void {
        this._evaluationResult.next(result);
    }

    getEvaluationResult(): Observable<EvaluationGlobalScore | null> {
        return this._evaluationResult.asObservable();
    }

    setEditorContent(editorContent: string): void {
        this._editorInfo.next(editorContent);
    }

    getEditorInfo(): Observable<string | null> {
        return this._editorInfo.asObservable();
    }
}
