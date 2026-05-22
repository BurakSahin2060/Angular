import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export type NotificationType = 'success' | 'error' | 'info';

export interface NotificationToast {
  id: string;
  type: NotificationType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<NotificationToast[]>([]);
  notifications$: Observable<NotificationToast[]> = this.notificationsSubject.asObservable();

  showSuccess(message: string): void {
    this.showNotification('success', message);
  }

  showError(message: string): void {
    this.showNotification('error', message);
  }

  showInfo(message: string): void {
    this.showNotification('info', message);
  }

  dismiss(id: string): void {
    const notifications = this.notificationsSubject.value.filter((notification) => notification.id !== id);
    this.notificationsSubject.next(notifications);
  }

  showNotification(type: NotificationType, message: string, duration = 5000): void {
    const notification: NotificationToast = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      message
    };

    this.notificationsSubject.next([...this.notificationsSubject.value, notification]);

    setTimeout(() => this.dismiss(notification.id), duration);
  }

  formatError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Unable to reach the server. Please check your connection.';
      }

      if (error.status === 404) {
        return error.error?.message || 'Requested resource was not found.';
      }

      if (error.error && typeof error.error === 'string') {
        return error.error;
      }

      if (error.error?.message) {
        return error.error.message;
      }
    }

    return fallback;
  }
}
