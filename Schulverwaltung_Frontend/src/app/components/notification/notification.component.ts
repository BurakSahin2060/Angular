import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      <ng-container *ngIf="notifications$ | async as notifications">
        <div *ngFor="let notification of notifications" class="rounded-3xl border p-4 shadow-xl transition duration-200" [ngClass]="getStyles(notification.type)">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <p class="text-sm font-semibold">{{ notification.type | titlecase }}</p>
              <p class="text-sm leading-6">{{ notification.message }}</p>
            </div>
            <button type="button" class="text-slate-500 hover:text-slate-900" (click)="dismiss(notification.id)">×</button>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class NotificationComponent {
  constructor(private notificationService: NotificationService) {}

  get notifications$() {
    return this.notificationService.notifications$;
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  getStyles(type: string): string {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-800';
      default:
        return 'border-sky-200 bg-sky-50 text-slate-900';
    }
  }
}
