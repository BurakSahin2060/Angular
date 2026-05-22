import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AnalyticsService } from '../../services/analytics.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Analytics</h1>
            <p class="text-sm text-slate-500 mt-1">Get fast insights for class and gender analytics.</p>
          </div>
          <div class="text-sm text-slate-500">All analytics load in real time.</div>
        </div>
      </section>

      <div class="grid gap-6 xl:grid-cols-3">
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Check if class fits in classroom</h2>
          <form [formGroup]="teachForm" (ngSubmit)="checkCanTeach()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Class</label>
              <input type="text" formControlName="klasse" placeholder="Enter class" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="teachForm.controls['klasse'].invalid && teachForm.controls['klasse'].touched" class="mt-2 text-xs text-rose-600">Class is required.</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Room name</label>
              <input type="text" formControlName="raumName" placeholder="Enter classroom name" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="teachForm.controls['raumName'].invalid && teachForm.controls['raumName'].touched" class="mt-2 text-xs text-rose-600">Room name is required.</div>
            </div>
            <button type="submit" [disabled]="teachForm.invalid || loadingCheck" class="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60">
              {{ loadingCheck ? 'Checking...' : 'Check availability' }}
            </button>
          </form>
          <div *ngIf="loadingCheck" class="mt-4 rounded-2xl bg-sky-50 p-4 text-sky-700">Checking availability...</div>
          <div *ngIf="canTeachResult" class="mt-4 rounded-2xl bg-emerald-50 p-4 text-emerald-700 font-semibold">{{ canTeachResult }}</div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Average Age</h2>
          <button (click)="loadAverageAge()" [disabled]="isLoadingAge" class="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60 mb-4">
            {{ isLoadingAge ? 'Loading...' : 'Load Average Age' }}
          </button>
          <div *ngIf="averageAge !== null" class="text-4xl font-bold text-emerald-600">{{ averageAge | number:'1.1-1' }}</div>
          <div *ngIf="averageAge === null && !isLoadingAge" class="text-sm text-slate-500">Click the button to load the latest average age.</div>
        </article>

        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Female Percentage</h2>
          <form [formGroup]="femaleForm" (ngSubmit)="loadFemalePercentage()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Class</label>
              <input type="text" formControlName="klasse" placeholder="Enter class" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200" />
              <div *ngIf="femaleForm.controls['klasse'].invalid && femaleForm.controls['klasse'].touched" class="mt-2 text-xs text-rose-600">Class is required.</div>
            </div>
            <button type="submit" [disabled]="femaleForm.invalid || isLoadingFemale" class="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60">
              {{ isLoadingFemale ? 'Loading...' : 'Load Female Percentage' }}
            </button>
          </form>
          <div *ngIf="femalePercentage !== null" class="mt-4 text-4xl font-bold text-violet-600">{{ femalePercentage | number:'1.1-1' }}%</div>
          <div *ngIf="femalePercentage === null && !isLoadingFemale" class="text-sm text-slate-500">Click the button to calculate the female percentage.</div>
        </article>
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
    private notificationService: NotificationService
  ) {
    this.teachForm = this.fb.group({
      klasse: ['', Validators.required],
      raumName: ['', Validators.required]
    });

    this.femaleForm = this.fb.group({
      klasse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.averageAge = null;
    this.femalePercentage = null;
    this.canTeachResult = null;
  }

  checkCanTeach(): void {
    if (!this.teachForm.valid) {
      return;
    }

    this.loadingCheck = true;
    this.canTeachResult = null;

    const { klasse, raumName } = this.teachForm.value;

    this.analyticsService
      .canTeach(klasse, raumName)
      .pipe(finalize(() => (this.loadingCheck = false)))
      .subscribe({
        next: (response) => {
          this.canTeachResult = response;
        },
        error: (error) => {
          console.error('Error checking teaching availability:', error);
          this.canTeachResult = 'Unable to check availability right now. Please try again later.';
          this.notificationService.showError('Unable to check classroom availability.');
        }
      });
  }

  loadAverageAge(): void {
    this.averageAge = null;
    this.isLoadingAge = true;

    this.analyticsService
      .getAverageAge()
      .pipe(finalize(() => (this.isLoadingAge = false)))
      .subscribe({
        next: (age) => {
          this.averageAge = age;
        },
        error: (error) => {
          console.error('Error loading average age:', error);
          this.averageAge = null;
          this.notificationService.showError('Unable to load average age. Please try again later.');
        }
      });
  }

  loadFemalePercentage(): void {
    if (!this.femaleForm.valid) {
      return;
    }

    this.femalePercentage = null;
    this.isLoadingFemale = true;

    const { klasse } = this.femaleForm.value;

    this.analyticsService
      .getFemalePercentage(klasse)
      .pipe(finalize(() => (this.isLoadingFemale = false)))
      .subscribe({
        next: (percentage) => {
          this.femalePercentage = percentage;
        },
        error: (error) => {
          console.error('Error loading female percentage:', error);
          this.femalePercentage = null;
          this.notificationService.showError('Unable to load female percentage. Please try again later.');
        }
      });
  }
}