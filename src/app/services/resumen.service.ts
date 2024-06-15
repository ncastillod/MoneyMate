import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { UtilsService } from './utils.service';
import { Gasto } from '../models/gastos.model';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) { }

  // Obtener resumen de gastos
  async getResumenGastos(): Promise<Gasto[]> {
    const user = this.getUser();
    const path = `users/${user.uid}/gastos`;

    try {
      const res: any[] = await this.firebaseSvc.getCollectionData(path).toPromise();
      const gastos: Gasto[] = res.map(item => ({
        id: item.id,
        descripcion: item.descripcion,
        categoria: item.categoria,
        monto: item.monto,
        fecha: item.fecha
      }));
      return gastos;
    } catch (error) {
      console.error('Error al obtener resumen de gastos:', error);
      throw error;
    }
  }

  // Obtener nombre del mes a partir de una fecha
  getMonth(fecha: string): string {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  // Calcular total de gastos por categoría y total general del mes actual
  async calculateTotalGastos(): Promise<{ totalGastosMes: number; totalPorCategoria: { [categoria: string]: number } }> {
    const user = this.getUser();
    const path = `users/${user.uid}/gastos`;

    try {
      const res: any[] = await this.firebaseSvc.getCollectionData(path).toPromise();

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const totalPorCategoria: { [categoria: string]: number } = {};
      let totalGastosMes = 0;

      res.forEach(gasto => {
        const gastoDate = new Date(gasto.fecha);
        if (gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentYear) {
          // Calcular total general del mes
          totalGastosMes += Number(gasto.monto);

          // Calcular total por categoría
          if (!totalPorCategoria[gasto.categoria]) {
            totalPorCategoria[gasto.categoria] = 0;
          }
          totalPorCategoria[gasto.categoria] += Number(gasto.monto);
        }
      });

      return { totalGastosMes, totalPorCategoria };
    } catch (error) {
      console.error('Error al calcular total de gastos:', error);
      throw error;
    }
  }

  // Método para obtener el usuario actual (ejemplo, puede variar según tu implementación)
  private getUser(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
}
