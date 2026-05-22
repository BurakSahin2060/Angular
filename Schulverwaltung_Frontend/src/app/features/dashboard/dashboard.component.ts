import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { StudentService } from '../../services/student.service';
import { AnalyticsService } from '../../services/analytics.service';
import { NotificationService } from '../../services/notification.service';
import { Student } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto">
      <section class="mb-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p class="text-sm text-slate-500 mt-1">Overview of student counts and school metrics.</p>
          </div>
          <div class="text-sm text-slate-500">
            <span *ngIf="isLoading">Refreshing data...</span>
            <span *ngIf="!isLoading">Last updated: {{ lastUpdated | date:'short' }}</span>
          </div>
        </div>
      </section>

      <div *ngIf="errorMessage" class="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="text-sm font-semibold uppercase tracking-wide text-slate-500">Total Students</div>
          <div class="mt-4 text-4xl font-bold text-sky-600">{{ totalStudents }}</div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="text-sm font-semibold uppercase tracking-wide text-slate-500">Average Age</div>
          <div class="mt-4 text-4xl font-bold text-emerald-600">{{ averageAge | number:'1.1-1' }}</div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="text-sm font-semibold uppercase tracking-wide text-slate-500">Classes</div>
          <div class="mt-4 text-4xl font-bold text-violet-600">{{ uniqueClasses.length }}</div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  totalStudents = 0;
  averageAge = 0;
  uniqueClasses: string[] = [];
  isLoading = false;
  errorMessage = '';
  lastUpdated: Date = new Date();

  constructor(
    private studentService: StudentService,
    private analyticsService: AnalyticsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      students: this.studentService.getAllStudents(),
      averageAge: this.analyticsService.getAverageAge()
    })
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: ({ students, averageAge }) => {
          this.totalStudents = students.length;
          this.uniqueClasses = [...new Set(students.map((s: Student) => s.klasse))];
          this.averageAge = averageAge;
          this.lastUpdated = new Date();
        },
        error: (error) => {
          const message = this.notificationService.formatError(error, 'Unable to load dashboard data.');
          console.error('Error loading dashboard data:', error);
          this.errorMessage = message;
          this.notificationService.showError(message);
        }
      });
  }
}