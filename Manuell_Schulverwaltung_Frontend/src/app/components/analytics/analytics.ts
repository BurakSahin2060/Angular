import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './analytics.html'
})
export class AnalyticsComponent {

  averageAge: number = 0;
  frauenAnteil: number = 0;
  klasse: string = '';

  constructor(private api: ApiService) {}

  loadAverageAge() {
    this.api.getAverageAge().subscribe({
      next: (res: any) => this.averageAge = res,
      error: (err) => console.error(err)
    });
  }

  loadFrauenAnteil() {
    this.api.getFemalePercentage(this.klasse).subscribe({
      next: (res: any) => this.frauenAnteil = res,
      error: (err) => console.error(err)
    });
  }
}