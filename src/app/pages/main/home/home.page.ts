import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { RouterLink } from '@angular/router';
import { ResumenService } from 'src/app/services/resumen.service';
import { AddUpdateGastoComponent } from 'src/app/shared/components/add-update-gasto/add-update-gasto.component';
import { User } from 'src/app/models/user.model';
import { Gasto } from 'src/app/models/gastos.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  

  totalGastosMes: number = 0;
  ingresos: any[] = [];
  presupuesto: number = 0;

  constructor(private resumenService: ResumenService) { }

  

  ngOnInit() {
    this.getGastos();
    this.getIngresos();
  }

 // Obtener ingresos desde Firebase
 getIngresos() {
  const user = this.utilsSvc.getFromLocalStorage('user');
  if (user) {
    this.firebaseSvc.getIngresos(user.uid).subscribe({
      next: (res: any[]) => {
        console.log(res);
        this.ingresos = res;
        this.presupuesto = res.reduce((acc, ingreso) => acc + Number(ingreso.monto), 0);
      }
    });
  }
}

  //======= Cerrar Sesion =====
  signOut(){
    this.firebaseSvc.signOut();
  }

  //======= Añadir Gasto =====
  addGasto(){
    this.utilsSvc.presentModal({
      component: AddUpdateGastoComponent,
      cssClass: 'add-update-modal'
    });
  }

  // Obtener gastos desde Firebase
  getGastos() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    if (user) {
      const path = `users/${user.uid}/gastos`;

      this.firebaseSvc.getCollectionData(path).subscribe({
        next: (res: Gasto[]) => {
          console.log(res);
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          this.totalGastosMes = res
            .filter(gasto => {
              const gastoDate = new Date(gasto.fecha);
              return gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentYear;
            })
            .reduce((acc, gasto) => acc + Number(gasto.monto), 0);
        }
      });
    }
  }


}
