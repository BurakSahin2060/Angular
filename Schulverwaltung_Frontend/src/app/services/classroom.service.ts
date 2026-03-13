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

  addClassroom(classroom: Omit<Classroom, 'id'>): Observable<Classroom> {
    return this.http.post<Classroom>(`${this.apiUrl}/add`, classroom);
  }
}