import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Gasto } from 'src/app/models/gastos.model';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  resumen: Gasto[] = [];
  totalGastosMes: number = 0;
  totalGastosMesAnterior: number = 0;
  totalPorCategoria: { [categoria: string]: number } = {};
  totalVivienda: number = 0;
  totalAlimentacion: number = 0;
  totalServicios: number = 0;
  totalTransporte: number = 0;
  totalOtros: number = 0;

  // Totales por categoría del mes anterior
  totalViviendaMesAnterior: number = 0;
  totalAlimentacionMesAnterior: number = 0;
  totalServiciosMesAnterior: number = 0;
  totalTransporteMesAnterior: number = 0;
  totalOtrosMesAnterior: number = 0;

  ngOnInit() {
    this.getGastos();
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getGastos();
  }

  // Obtener gastos desde Firebase
  getGastos() {
    let path = `users/${this.user().uid}/gastos`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: Gasto[]) => {
        this.resumen = res.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.calculateTotals();
        sub.unsubscribe();
      },
      error: (err) => {
        console.error('Error fetching gastos:', err);
      }
    });
  }

  // Obtener nombre del mes a partir de una fecha
  getMonth(fecha: string): string {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  // Calcular totales por categoría y total general del mes actual y del mes anterior
  calculateTotals() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const previousMonthDate = new Date();
    previousMonthDate.setMonth(currentMonth - 1);
    const previousMonth = previousMonthDate.getMonth();
    const previousMonthYear = previousMonthDate.getFullYear();

    this.totalPorCategoria = {};

    // Totales mes actual
    this.totalGastosMes = 0;
    
    this.totalVivienda = 0;
    this.totalAlimentacion = 0;
    this.totalServicios = 0;
    this.totalTransporte = 0;
    this.totalOtros = 0;

    // Totales mes anterior
    this.totalGastosMesAnterior = 0;

    this.totalViviendaMesAnterior = 0;
    this.totalAlimentacionMesAnterior = 0;
    this.totalServiciosMesAnterior = 0;
    this.totalTransporteMesAnterior = 0;
    this.totalOtrosMesAnterior = 0;

    const gastosFiltrados = this.resumen.filter(gasto => {
      const gastoDate = new Date(gasto.fecha);
      return gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentYear;
    });

    const gastosMesAnterior = this.resumen.filter(gasto => {
      const gastoDate = new Date(gasto.fecha);
      return gastoDate.getMonth() === previousMonth && gastoDate.getFullYear() === previousMonthYear;
    });

    gastosFiltrados.forEach(gasto => {
      this.totalGastosMes += Number(gasto.monto);

      if (!this.totalPorCategoria[gasto.categoria]) {
        this.totalPorCategoria[gasto.categoria] = 0;
      }
      this.totalPorCategoria[gasto.categoria] += Number(gasto.monto);

      switch (gasto.categoria) {
        case 'Vivienda':
          this.totalVivienda += Number(gasto.monto);
          break;
        case 'Alimentacion':
          this.totalAlimentacion += Number(gasto.monto);
          break;
        case 'Servicios':
          this.totalServicios += Number(gasto.monto);
          break;
        case 'Transporte':
          this.totalTransporte += Number(gasto.monto);
          break;
        case 'Otros':
          this.totalOtros += Number(gasto.monto);
          break;
        default:
          break;
      }
    });

    gastosMesAnterior.forEach(gasto => {
      this.totalGastosMesAnterior += Number(gasto.monto);

      switch (gasto.categoria) {
        case 'Vivienda':
          this.totalViviendaMesAnterior += Number(gasto.monto);
          break;
        case 'Alimentacion':
          this.totalAlimentacionMesAnterior += Number(gasto.monto);
          break;
        case 'Servicios':
          this.totalServiciosMesAnterior += Number(gasto.monto);
          break;
        case 'Transporte':
          this.totalTransporteMesAnterior += Number(gasto.monto);
          break;
        case 'Otros':
          this.totalOtrosMesAnterior += Number(gasto.monto);
          break;
        default:
          break;
      }
    });

    console.log('Total Vivienda:', this.totalVivienda);
    console.log('Total Alimentacion:', this.totalAlimentacion);
    console.log('Total Servicios:', this.totalServicios);
    console.log('Total Transporte:', this.totalTransporte);
    console.log('Total Otros:', this.totalOtros);
    console.log('Total Gastos Mes Anterior:', this.totalGastosMesAnterior);
  }

  // Método para obtener las claves del objeto totalPorCategoria
  getCategorias(): string[] {
    return Object.keys(this.totalPorCategoria);
  }
}
