import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { StudentService } from '../../services/student.service';
import { NotificationService } from '../../services/notification.service';
import { Student } from '../../models/models';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <section class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Students</h1>
            <p class="text-sm text-slate-500 mt-1">Manage students and monitor classroom assignments.</p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p class="text-sm text-slate-600">{{ students.length }} students</p>
            <span *ngIf="isLoadingList" class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Loading...</span>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Add New Student</h2>
          <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="grid gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Name</label>
              <input type="text" formControlName="name" placeholder="Enter full name" class="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="studentForm.controls['name'].invalid && studentForm.controls['name'].touched" class="mt-2 text-xs text-rose-600">Name is required.</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Birthday</label>
              <input type="date" formControlName="geburtstag" class="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="studentForm.controls['geburtstag'].invalid && studentForm.controls['geburtstag'].touched" class="mt-2 text-xs text-rose-600">Birthday is required.</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Gender</label>
              <select formControlName="geschlecht" class="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div *ngIf="studentForm.controls['geschlecht'].invalid && studentForm.controls['geschlecht'].touched" class="mt-2 text-xs text-rose-600">Gender is required.</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Class</label>
              <input type="text" formControlName="klasse" placeholder="Enter class" class="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="studentForm.controls['klasse'].invalid && studentForm.controls['klasse'].touched" class="mt-2 text-xs text-rose-600">Class is required.</div>
            </div>
            <button type="submit" [disabled]="studentForm.invalid || isSubmitting" class="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
              {{ isSubmitting ? 'Adding student...' : 'Add Student' }}
            </button>
          </form>

          <div *ngIf="successMessage" class="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
            {{ successMessage }}
          </div>
          <div *ngIf="submitErrorMessage" class="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            {{ submitErrorMessage }}
          </div>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Student List</h2>
              <p class="text-sm text-slate-500">Quickly filter students and review details.</p>
            </div>
            <input type="text" [(ngModel)]="filterClass" placeholder="Filter by class" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 sm:w-80" />
          </div>

          <div *ngIf="isLoadingList" class="mt-6 rounded-2xl bg-sky-50 p-4 text-slate-700">Loading students…</div>
          <div *ngIf="loadErrorMessage" class="mt-6 rounded-2xl bg-rose-50 p-4 text-rose-700">{{ loadErrorMessage }}</div>

          <div *ngIf="!isLoadingList && filteredStudents.length === 0" class="mt-6 rounded-2xl bg-slate-50 p-6 text-slate-600">
            {{ students.length > 0 ? 'No students match this filter.' : 'No students found.' }}
          </div>

          <div *ngIf="filteredStudents.length > 0" class="mt-6 overflow-x-auto rounded-3xl border border-slate-200">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-4">Name</th>
                  <th class="px-6 py-4">Class</th>
                  <th class="px-6 py-4">Gender</th>
                  <th class="px-6 py-4">Birthday</th>
                  <th class="px-6 py-4">Age</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr *ngFor="let student of filteredStudents" class="hover:bg-slate-50">
                  <td class="px-6 py-4">{{ student.name }}</td>
                  <td class="px-6 py-4">{{ student.klasse }}</td>
                  <td class="px-6 py-4">{{ student.geschlecht }}</td>
                  <td class="px-6 py-4">{{ student.geburtstag }}</td>
                  <td class="px-6 py-4">{{ student.alter }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class StudentsComponent implements OnInit {
  studentForm: FormGroup;
  students: Student[] = [];
  isLoadingList = false;
  isSubmitting = false;
  successMessage = '';
  submitErrorMessage = '';
  loadErrorMessage = '';
  filterClass = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private notificationService: NotificationService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      geburtstag: ['', Validators.required],
      geschlecht: ['', Validators.required],
      klasse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoadingList = true;
    this.loadErrorMessage = '';

    this.studentService.getAllStudents()
      .pipe(finalize(() => (this.isLoadingList = false)))
      .subscribe({
        next: (students) => {
          this.students = students;
        },
        error: (error) => {
          const message = this.notificationService.formatError(error, 'Unable to load students.');
          console.error('Error loading students:', error);
          this.loadErrorMessage = message;
          this.notificationService.showError(message);
        }
      });
  }

  onSubmit(): void {
    if (!this.studentForm.valid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.submitErrorMessage = '';

    this.studentService
      .addStudent(this.studentForm.value)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          const message = 'Student added successfully.';
          this.successMessage = message;
          this.notificationService.showSuccess(message);
          this.studentForm.reset();
          this.loadStudents();
        },
        error: (error) => {
          const message = this.notificationService.formatError(error, 'Unable to add student. Please check the form and try again.');
          console.error('Error adding student:', error);
          this.submitErrorMessage = message;
          this.notificationService.showError(message);
        }
      });
  }

  get filteredStudents() {
    if (!this.filterClass) {
      return this.students;
    }

    return this.students.filter((s) =>
      s.klasse.toLowerCase().includes(this.filterClass.toLowerCase())
    );
  }
}