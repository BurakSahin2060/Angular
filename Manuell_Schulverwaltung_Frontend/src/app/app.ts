import { Component } from '@angular/core';
import { AddStudentComponent } from './components/add-student/add-student';
import { StudentListComponent } from './components/student-list/student-list';
import { AddRoomComponent } from './components/add-room/add-room';
import { AnalyticsComponent } from './components/analytics/analytics';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AddStudentComponent,
    StudentListComponent,
    AddRoomComponent,
    AnalyticsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}