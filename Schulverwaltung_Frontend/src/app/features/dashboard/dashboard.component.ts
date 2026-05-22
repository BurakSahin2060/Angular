import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { AnalyticsService } from '../../services/analytics.service';
import { Student } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700">Total Students</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalStudents }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700">Average Age</h3>
          <p class="text-3xl font-bold text-green-600">{{ averageAge | number:'1.1-1' }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700">Classes</h3>
          <p class="text-3xl font-bold text-purple-600">{{ uniqueClasses.length }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalStudents = 0;
  averageAge = 0;
  uniqueClasses: string[] = [];
  private navigationSubscription?: Subscription;

  constructor(
    private studentService: StudentService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {}

ngOnInit() {
  setTimeout(() => {
    this.loadData(); // oder loadStudents()
  });
}

  ngOnDestroy() {
    this.navigationSubscription?.unsubscribe();
  }

  loadData() {
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.totalStudents = students.length;
        this.uniqueClasses = [...new Set(students.map(s => s.klasse))];
      },
      error: (error) => console.error('Error loading students:', error)
    });

    this.analyticsService.getAverageAge().subscribe({
      next: (age) => this.averageAge = age,
      error: (error) => console.error('Error loading average age:', error)
    });
  }
}