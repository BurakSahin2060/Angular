import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiBaseUrl}/api/schule/analytics`;

  constructor(private http: HttpClient) {}

  canTeach(klasse: string, raumName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/kannUnterrichten/${klasse}/${raumName}`);
  }

  getAverageAge(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/durchschnittsalter`);
  }

  getFemalePercentage(klasse: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/frauenanteil/${klasse}`);
  }
}