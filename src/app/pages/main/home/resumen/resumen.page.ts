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
  totalPorCategoria: { [categoria: string]: number } = {};

  ngOnInit() {
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
        console.log(res);
        this.resumen = res.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.calculateTotalGastos();
        sub.unsubscribe();
      }
    });
  }

  // Obtener nombre del mes a partir de una fecha
  getMonth(fecha: string): string {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  // Calcular total de gastos por categoría y total general del mes actual
  calculateTotalGastos() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    this.totalPorCategoria = {};
    this.totalGastosMes = 0;

    this.resumen
      .filter(gasto => {
        const gastoDate = new Date(gasto.fecha);
        return gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentYear;
      })
      .forEach(gasto => {
        // Calcular total general del mes
        this.totalGastosMes += Number(gasto.monto);

        // Calcular total por categoría
        if (!this.totalPorCategoria[gasto.categoria]) {
          this.totalPorCategoria[gasto.categoria] = 0;
        }
        this.totalPorCategoria[gasto.categoria] += Number(gasto.monto);
      });
  }

  // Método para obtener las claves del objeto totalPorCategoria
  getCategorias(): string[] {
    return Object.keys(this.totalPorCategoria);
  }
}
