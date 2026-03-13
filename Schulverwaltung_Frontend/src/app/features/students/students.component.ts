import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/models';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Students</h1>

      <!-- Add Student Form -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Add New Student</h2>
        <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Geburtstag</label>
            <input type="date" formControlName="geburtstag" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Geschlecht</label>
            <select formControlName="geschlecht" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option value="">Select</option>
              <option value="männlich">Männlich</option>
              <option value="weiblich">Weiblich</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Klasse</label>
            <input type="text" formControlName="klasse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div class="md:col-span-2">
            <button type="submit" [disabled]="studentForm.invalid || isLoading" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ isLoading ? 'Adding...' : 'Add Student' }}
            </button>
          </div>
        </form>
        <div *ngIf="successMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded">{{ successMessage }}</div>
        <div *ngIf="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded">{{ errorMessage }}</div>
      </div>

      <!-- Filter -->
      <div class="mb-4">
        <input type="text" [(ngModel)]="filterClass" placeholder="Filter by class" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
      </div>

      <!-- Students Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Klasse</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geschlecht</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Geburtstag</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alter</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let student of filteredStudents" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ student.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ student.klasse }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ student.geschlecht }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ student.geburtstag }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ student.alter }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class StudentsComponent implements OnInit {
  studentForm: FormGroup;
  students: Student[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  filterClass = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      geburtstag: ['', Validators.required],
      geschlecht: ['', Validators.required],
      klasse: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (students) => this.students = students,
      error: (error) => console.error('Error loading students:', error)
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';
      this.studentService.addStudent(this.studentForm.value).subscribe({
        next: () => {
          this.successMessage = 'Student added successfully!';
          this.studentForm.reset();
          this.loadStudents();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error adding student.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
    }
  }

  get filteredStudents() {
    if (!this.filterClass) return this.students;
    return this.students.filter(s => s.klasse.toLowerCase().includes(this.filterClass.toLowerCase()));
  }
}