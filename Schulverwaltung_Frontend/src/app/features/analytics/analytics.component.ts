import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Analytics</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Can Teach Check -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Check if Class Fits in Classroom</h2>
          <form [formGroup]="teachForm" (ngSubmit)="checkCanTeach()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Klasse</label>
              <input type="text" formControlName="klasse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Raum Name</label>
              <input type="text" formControlName="raumName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <button type="submit" [disabled]="teachForm.invalid || loadingCheck" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{ loadingCheck ? 'Checking...' : 'Check' }}
            </button>
          </form>
          <div *ngIf="loadingCheck" class="text-blue-500 font-semibold mt-4">Checking...</div>
          <div *ngIf="canTeachResult" class="mt-4 p-4 rounded-xl shadow-md bg-green-100 text-green-800 font-bold">
            {{ canTeachResult }}
          </div>
        </div>

        <!-- Average Age -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Average Age</h2>
          <button (click)="loadAverageAge()" [disabled]="isLoadingAge" class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 mb-4">
            {{ isLoadingAge ? 'Loading...' : 'Load Average Age' }}
          </button>
          <div *ngIf="averageAge !== null" class="text-2xl font-bold text-green-600">
            {{ averageAge | number:'1.1-1' }} years
          </div>
        </div>

        <!-- Female Percentage -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Female Percentage</h2>
          <form [formGroup]="femaleForm" (ngSubmit)="loadFemalePercentage()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Klasse</label>
              <input type="text" formControlName="klasse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <button type="submit" [disabled]="femaleForm.invalid || isLoadingFemale" class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50">
              {{ isLoadingFemale ? 'Loading...' : 'Load Female %' }}
            </button>
          </form>
          <div *ngIf="femalePercentage !== null" class="mt-4 text-2xl font-bold text-purple-600">
            {{ femalePercentage | number:'1.1-1' }}%
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AnalyticsComponent implements OnInit {
  teachForm: FormGroup;
  femaleForm: FormGroup;
  canTeachResult: string | null = null;
  averageAge: number | null = null;
  femalePercentage: number | null = null;
  loadingCheck = false;
  isLoadingAge = false;
  isLoadingFemale = false;

  constructor(
    private fb: FormBuilder,
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {
    this.teachForm = this.fb.group({
      klasse: ['', Validators.required],
      raumName: ['', Validators.required]
    });

    this.femaleForm = this.fb.group({
      klasse: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.resetAnalyticsState();
  }

  resetAnalyticsState() {
    this.canTeachResult = null;
    this.averageAge = null;
    this.femalePercentage = null;
    this.loadingCheck = false;
    this.isLoadingAge = false;
    this.isLoadingFemale = false;
  }

  checkCanTeach() {
    if (this.teachForm.valid) {
      this.loadingCheck = true;
      this.canTeachResult = null;
      const { klasse, raumName } = this.teachForm.value;
      this.analyticsService.canTeach(klasse, raumName).subscribe({
        next: (response) => {
          this.canTeachResult = response;
          this.loadingCheck = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          console.log('Error error:', error.error);
          console.log('Full error:', error);
          this.loadingCheck = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadAverageAge() {
    this.averageAge = null;
    this.isLoadingAge = true;
    this.analyticsService.getAverageAge().subscribe({
      next: (age) => {
        this.averageAge = age;
        this.isLoadingAge = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading average age:', error);
        this.isLoadingAge = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFemalePercentage() {
    if (this.femaleForm.valid) {
      this.femalePercentage = null;
      this.isLoadingFemale = true;
      const { klasse } = this.femaleForm.value;
      this.analyticsService.getFemalePercentage(klasse).subscribe({
        next: (percentage) => {
          this.femalePercentage = percentage;
          this.isLoadingFemale = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading female percentage:', error);
          this.isLoadingFemale = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}