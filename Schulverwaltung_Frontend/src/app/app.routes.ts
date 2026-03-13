import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentsComponent } from './features/students/students.component';
import { ClassroomsComponent } from './features/classrooms/classrooms.component';
import { AnalyticsComponent } from './features/analytics/analytics.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'classrooms', component: ClassroomsComponent },
      { path: 'analytics', component: AnalyticsComponent }
    ]
  }
];
