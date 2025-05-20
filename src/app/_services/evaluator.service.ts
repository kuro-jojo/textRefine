import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { EvaluationGlobalScore } from '../_models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluatorService {
  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  evaluateText(text: string): Observable<EvaluationGlobalScore> {
    return this.http.post<EvaluationGlobalScore>(`${this.API_URL}/evaluate`, { text });
  }
}
