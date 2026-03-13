import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiBaseUrl}/api/schueler`;

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/all`);
  }

  getStudentsByClass(klasse: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/byKlasse/${klasse}`);
  }

  addStudent(student: Omit<Student, 'id' | 'alter'>): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/add`, student);
  }
}