import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../components/notification/notification.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NotificationComponent],
  template: `
    <div class="min-h-screen bg-slate-100 text-slate-900">
      <app-notification></app-notification>
      <div class="md:hidden bg-slate-900 text-white px-4 py-4 flex items-center justify-between">
        <div class="font-semibold text-lg">School Management</div>
        <button (click)="toggleSidebar()" class="rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800 transition">
          <span *ngIf="!isSidebarOpen">Menu</span>
          <span *ngIf="isSidebarOpen">Close</span>
        </button>
      </div>

      <div class="flex">
        <aside class="hidden md:flex md:w-72 lg:w-80 bg-slate-950 text-white flex-col border-r border-slate-800">
          <div class="p-6 border-b border-slate-800">
            <h1 class="text-2xl font-bold">School Management</h1>
          </div>
          <nav class="flex-1 p-4 space-y-2">
            <a routerLink="dashboard" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Dashboard</a>
            <a routerLink="students" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Students</a>
            <a routerLink="classrooms" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Classrooms</a>
            <a routerLink="analytics" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Analytics</a>
          </nav>
        </aside>

        <div class="flex-1">
          <div *ngIf="isSidebarOpen" class="fixed inset-0 z-40 bg-slate-950/80 md:hidden" (click)="toggleSidebar()"></div>
          <aside *ngIf="isSidebarOpen" class="fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white flex flex-col border-r border-slate-800 md:hidden">
            <div class="p-6 border-b border-slate-800 flex items-center justify-between">
              <span class="text-lg font-semibold">School Management</span>
              <button (click)="toggleSidebar()" class="rounded-md border border-slate-700 px-3 py-2 hover:bg-slate-800 transition">Close</button>
            </div>
            <nav class="flex-1 p-4 space-y-2">
              <a routerLink="dashboard" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Dashboard</a>
              <a routerLink="students" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Students</a>
              <a routerLink="classrooms" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Classrooms</a>
              <a routerLink="analytics" routerLinkActive="bg-slate-800 text-white" class="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition">Analytics</a>
            </nav>
          </aside>

          <main class="min-h-screen p-4 md:p-6 lg:p-8">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LayoutComponent {
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}