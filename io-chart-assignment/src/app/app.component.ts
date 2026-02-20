import { Component } from '@angular/core';
import { ChartComponent, ChartOptions } from './chart/chart.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChartComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  options: ChartOptions = {
    type: 'line',
    title: 'Sales Overview',
    series: [
      { name: 'Offline', value: 30, color: '#8b5cf6' },
      { name: 'Online', value: 70, color: '#22d3ee' },
    ],
  };

  chartType: 'line' | 'column' | 'pie' = 'line';
  title: string = 'Sales Overview';
  offlineValue: number = 30;
  onlineValue: number = 70;

  updateChart() {
    this.options = {
      type: this.chartType,
      title: this.title,
      series: [
        { name: 'Offline', value: this.offlineValue, color: '#8b5cf6' },
        { name: 'Online', value: this.onlineValue, color: '#22d3ee' },
      ],
    };
  }
}
