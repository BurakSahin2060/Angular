import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ClassroomService } from '../../services/classroom.service';
import { NotificationService } from '../../services/notification.service';
import { Classroom } from '../../models/models';

@Component({
  selector: 'app-classrooms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Classrooms</h1>
            <p class="text-sm text-slate-500 mt-1">Manage classrooms and keep track of available capacity.</p>
          </div>
          <div class="text-sm text-slate-500">Automatically refreshed after each update.</div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Add New Classroom</h2>
          <form [formGroup]="classroomForm" (ngSubmit)="onSubmit()" class="grid gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Room name</label>
              <input type="text" formControlName="name" placeholder="Enter room name" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="classroomForm.controls['name'].invalid && classroomForm.controls['name'].touched" class="mt-2 text-xs text-rose-600">Room name is required.</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">Size (sqm)</label>
              <input type="number" formControlName="raumInQm" placeholder="Enter size in sqm" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="classroomForm.controls['raumInQm'].invalid && classroomForm.controls['raumInQm'].touched" class="mt-2 text-xs text-rose-600">Enter a valid room size.</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700">Seats</label>
              <input type="number" formControlName="plaetze" placeholder="Enter number of seats" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="classroomForm.controls['plaetze'].invalid && classroomForm.controls['plaetze'].touched" class="mt-2 text-xs text-rose-600">Enter a valid seat count.</div>
            </div>

            <div class="flex items-center gap-3">
              <label class="inline-flex items-center gap-3 text-sm text-slate-700">
                <input type="checkbox" formControlName="hasCynap" class="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                Cynap available
              </label>
            </div>

            <button type="submit" [disabled]="classroomForm.invalid || isAdding" class="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60">
              {{ isAdding ? 'Adding...' : 'Add Classroom' }}
            </button>
          </form>

          <div *ngIf="successMessage" class="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
            {{ successMessage }}
          </div>
          <div *ngIf="submitErrorMessage" class="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            {{ submitErrorMessage }}
          </div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Available Classrooms</h2>
              <p class="text-sm text-slate-500">Quickly see which rooms are available.</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm text-slate-600">{{ rooms.length }} rooms</span>
              <span *ngIf="isLoadingRooms" class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Loading…</span>
            </div>
          </div>

          <div *ngIf="loadErrorMessage" class="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            {{ loadErrorMessage }}
          </div>

          <div *ngIf="!isLoadingRooms && rooms.length === 0" class="mt-6 rounded-2xl bg-slate-50 p-6 text-slate-600">
            No classrooms found.
          </div>

          <div *ngIf="rooms.length > 0" class="mt-6 overflow-x-auto rounded-3xl border border-slate-200">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 uppercase tracking-wider">
                <tr>
                  <th class="px-6 py-4">Room name</th>
                  <th class="px-6 py-4">Size (sqm)</th>
                  <th class="px-6 py-4">Seats</th>
                  <th class="px-6 py-4">Cynap</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr *ngFor="let room of rooms" class="hover:bg-slate-50">
                  <td class="px-6 py-4">{{ room.name }}</td>
                  <td class="px-6 py-4">{{ room.raumInQm }}</td>
                  <td class="px-6 py-4">{{ room.plaetze }}</td>
                  <td class="px-6 py-4">{{ room.hasCynap ? 'Yes' : 'No' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  `,
  styles: []
})
export class ClassroomsComponent implements OnInit {
  classroomForm: FormGroup;
  rooms: Classroom[] = [];
  isLoadingRooms = false;
  isAdding = false;
  successMessage = '';
  submitErrorMessage = '';
  loadErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private classroomService: ClassroomService,
    private notificationService: NotificationService
  ) {
    this.classroomForm = this.fb.group({
      name: ['', Validators.required],
      raumInQm: [0, [Validators.required, Validators.min(1)]],
      plaetze: [0, [Validators.required, Validators.min(1)]],
      hasCynap: [false]
    });
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoadingRooms = true;
    this.loadErrorMessage = '';

    this.classroomService.getAllClassrooms()
      .pipe(finalize(() => (this.isLoadingRooms = false)))
      .subscribe({
        next: (rooms) => {
          this.rooms = rooms;
        },
        error: (error) => {
          const message = this.notificationService.formatError(error, 'Unable to load classrooms.');
          console.error('Error loading classrooms:', error);
          this.loadErrorMessage = message;
          this.notificationService.showError(message);
        }
      });
  }

  onSubmit(): void {
    if (!this.classroomForm.valid) {
      this.classroomForm.markAllAsTouched();
      return;
    }

    this.isAdding = true;
    this.successMessage = '';
    this.submitErrorMessage = '';

    const payload = this.classroomForm.value;

    this.classroomService.addClassroom(payload)
      .pipe(finalize(() => (this.isAdding = false)))
      .subscribe({
        next: () => {
          const message = 'Classroom added successfully.';
          this.successMessage = message;
          this.notificationService.showSuccess(message);
          this.classroomForm.reset({
            name: '',
            raumInQm: 0,
            plaetze: 0,
            hasCynap: false
          });
          this.loadRooms();
        },
        error: (error) => {
          const message = this.notificationService.formatError(error, 'Unable to add classroom. Please check the form and try again.');
          console.error('Error adding classroom:', error);
          this.submitErrorMessage = message;
          this.notificationService.showError(message);
        }
      });
  }
}
