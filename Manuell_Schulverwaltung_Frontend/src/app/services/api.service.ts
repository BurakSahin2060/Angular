import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://localhost:5287/api';

  constructor(private http: HttpClient) {}

  addStudent(data: any) {
    return this.http.post(`${this.baseUrl}/schueler/add`, data);
  }

  getStudents() {
    return this.http.get(`${this.baseUrl}/schueler/all`);
  }

  getByKlasse(klasse: string) {
    return this.http.get(`${this.baseUrl}/schueler/byKlasse/${klasse}`);
  }

  addRoom(data: any) {
    return this.http.post(`${this.baseUrl}/klassenraum/add`, data);
  }

  getAverageAge() {
    return this.http.get(`${this.baseUrl}/schule/analytics/durchschnittsalter`);
  }

  getFemalePercentage(klasse: string) {
    return this.http.get(`${this.baseUrl}/schule/analytics/frauenanteil/${klasse}`);
  }
}