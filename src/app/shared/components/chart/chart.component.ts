import { Component, OnInit, Input } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() totalGastos: number;
  @Input() totalIngresos: number;

  public chartOptions: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    responsive: ApexResponsive[];
  };

  constructor() { }

  ngOnInit() {
    this.chartOptions = {
      series: [this.totalGastos, this.totalIngresos],
      chart: {
        type: 'pie'
      },
      labels: ['Gastos', 'Ingresos'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }
}
