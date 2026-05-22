import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classroom } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = `${environment.apiBaseUrl}/api/klassenraum`;

  constructor(private http: HttpClient) {}

  getAllClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(`${this.apiUrl}/all`);
  }

  addClassroom(classroom: Omit<Classroom, 'id'>): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/add`, classroom);
  }
}