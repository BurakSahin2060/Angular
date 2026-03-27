import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassroomService } from '../../services/classroom.service';

@Component({
  selector: 'app-classrooms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Classrooms</h1>

      <div class="bg-white rounded-xl shadow-md p-6 max-w-md">
        <h2 class="text-xl font-semibold mb-4">Add New Classroom</h2>
        <form [formGroup]="classroomForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" formControlName="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Raum in qm</label>
            <input type="number" formControlName="raumInQm" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Plätze</label>
            <input type="number" formControlName="plaetze" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div class="mb-4">
            <label class="flex items-center">
              <input type="checkbox" formControlName="hasCynap" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200">
              <span class="ml-2 text-sm text-gray-700">Has Cynap</span>
            </label>
          </div>
          <button type="submit" [disabled]="classroomForm.invalid || isLoading" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {{ isLoading ? 'Adding...' : 'Add Classroom' }}
          </button>
        </form>
        <div *ngIf="successMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded">{{ successMessage }}</div>
        <div *ngIf="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded">{{ errorMessage }}</div>
      </div>
    </div>
  `,
  styles: []
})
export class ClassroomsComponent {
  classroomForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private classroomService: ClassroomService
  ) {
    this.classroomForm = this.fb.group({
      name: ['', Validators.required],
      raumInQm: [0, [Validators.required, Validators.min(1)]],
      plaetze: [0, [Validators.required, Validators.min(1)]],
      hasCynap: [false]
    });
  }

  onSubmit() {
    if (this.classroomForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.classroomService.addClassroom(this.classroomForm.value).subscribe({
        next: () => {
          this.successMessage = 'Classroom added successfully!';
          this.classroomForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error adding classroom.';
          this.isLoading = false;
          console.error('Error:', error);
        }
      });
    }
  }
}