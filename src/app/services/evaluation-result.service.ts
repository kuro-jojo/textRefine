import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EvaluationGlobalScore } from '../models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationResultService {
  private _evaluationResult = new BehaviorSubject<EvaluationGlobalScore | null>(null);
  private _rawText = new BehaviorSubject<string>('');

  constructor() { }

  setEvaluationResult(result: EvaluationGlobalScore): void {
    this._evaluationResult.next(result);
  }

  getEvaluationResult(): Observable<EvaluationGlobalScore | null> {
    return this._evaluationResult.asObservable();
  }

  setRawText(text: string): void {
    this._rawText.next(text);
  }

  getRawText(): Observable<string> {
    return this._rawText.asObservable();
  }
}
