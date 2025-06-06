import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EvaluationGlobalScore, EvaluationRequest } from '../models/evaluation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  evaluateText(request: EvaluationRequest): Observable<EvaluationGlobalScore> {
    return this.http.post<EvaluationGlobalScore>(`${this.apiUrl}/evaluation`, request);
  }
}
