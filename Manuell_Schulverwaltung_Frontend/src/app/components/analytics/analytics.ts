import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent {

  averageAge: number = 0;
  frauenAnteil: number = 0;
  klasse: string = '';

  constructor(private http: HttpClient) {}

loadAverageAge() {
  this.http.get<number>('http://localhost:5287/api/schule/analytics/durchschnittsalter')
    .subscribe({
      next: (data) => this.averageAge = data,
      error: (err) => console.error(err)
    });
}

loadFrauenAnteil() {
  this.http.get<number>(`http://localhost:5287/api/schule/analytics/frauenanteil/${this.klasse}`)
    .subscribe({
      next: (data) => this.frauenAnteil = data,
      error: (err) => console.error(err)
    });
}
}