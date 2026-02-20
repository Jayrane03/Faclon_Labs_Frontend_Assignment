import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

export interface ChartSeries {
  name: string;
  value: number;
  color: string;
}

export interface ChartOptions {
  type: 'line' | 'column' | 'pie';
  title: string;
  series: ChartSeries[];
}

interface PieSlice extends ChartSeries {
  startAngle: number;
  angle: number;
  path: string;
}

@Component({
  selector: 'io-chart',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
  @Input() chartOptions!: ChartOptions;

  width = 360;
  height = 220;
  padding = 30;
hoverText: string = '';
hoverX: number = 0;
hoverY: number = 0;
showTooltip = false;

onHover(text: string, x: number, y: number) {
  this.hoverText = text;
  this.hoverX = x + 10;
  this.hoverY = y - 10;
  this.showTooltip = true;
}

onLeave() {
  this.showTooltip = false;
}
  get maxValue(): number {
    return Math.max(...this.chartOptions.series.map(s => s.value), 10);
  }

  scaleY(value: number): number {
    const usableHeight = this.height - this.padding * 2;
    return this.height - this.padding - (value / this.maxValue) * usableHeight;
  }

  scaleX(index: number): number {
    const usableWidth = this.width - this.padding * 2;
    if (this.chartOptions.series.length === 1) return this.padding + usableWidth / 2;
    return this.padding + (usableWidth / (this.chartOptions.series.length - 1)) * index;
  }

  get linePoints(): string {
    return this.chartOptions.series
      .map((s, i) => `${this.scaleX(i)},${this.scaleY(s.value)}`)
      .join(' ');
  }

  get yTicks(): number[] {
    return [0, 0.25, 0.5, 0.75, 1].map(p => Math.round(this.maxValue * p));
  }

  get total(): number {
    return this.chartOptions.series.reduce((sum, s) => sum + s.value, 0);
  }

  get pieSlices(): PieSlice[] {
    let startAngle = 0;
    const radius = 100;

    return this.chartOptions.series.map((s) => {
      const angle = (s.value / this.total) * 360;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = ((startAngle + angle) * Math.PI) / 180;

      const x1 = radius * Math.cos(startRad);
      const y1 = radius * Math.sin(startRad);
      const x2 = radius * Math.cos(endRad);
      const y2 = radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const slice: PieSlice = {
        ...s,
        startAngle,
        angle,
        path,
      };

      startAngle += angle;
      return slice;
    });
  }
}
