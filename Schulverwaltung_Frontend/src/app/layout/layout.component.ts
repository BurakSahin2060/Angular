import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-slate-900 text-white flex flex-col">
        <div class="p-6">
          <h1 class="text-2xl font-bold">School Management</h1>
        </div>
        <nav class="flex-1 px-4">
          <ul class="space-y-2">
            <li>
              <a routerLink="/dashboard" routerLinkActive="bg-slate-700" class="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a routerLink="/students" routerLinkActive="bg-slate-700" class="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
                Students
              </a>
            </li>
            <li>
              <a routerLink="/classrooms" routerLinkActive="bg-slate-700" class="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
                Classrooms
              </a>
            </li>
            <li>
              <a routerLink="/analytics" routerLinkActive="bg-slate-700" class="block px-4 py-2 rounded hover:bg-slate-700 transition-colors">
                Analytics
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main content -->
      <div class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: []
})
export class LayoutComponent {}