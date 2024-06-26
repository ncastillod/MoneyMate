import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ResumenService } from 'src/app/services/resumen.service';
import { AddUpdateGastoComponent } from 'src/app/shared/components/add-update-gasto/add-update-gasto.component';
import { Gasto } from 'src/app/models/gastos.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  totalGastosMes: number = 0;
  ingresos: any[] = [];
  ingfijo: any[] = [];
  meta: any[] = [];
  presupuesto: number = 0;
  ingfijofinal: number = 0;
  metafinal: number = 0;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private resumenService: ResumenService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getGastos();
    this.getMeta();
    this.getIngresoFijo();
    this.getIngresos();
    
    
  }

  // Obtener ingresos desde Firebase
  getIngresos() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    
    if (user) {
      this.firebaseSvc.getIngresos(user.uid).subscribe({
        next: (res: any[]) => {
          this.ingresos = res;
          this.presupuesto = res.reduce((acc, ingreso) => acc + Number(ingreso.monto), 0) + this.ingfijofinal;
        },
        error: (err) => {
          console.error('Error fetching ingresos:', err);
        }
      });
    }
  }
  
  
  // Obtener ingresos desde Firebase
  getIngresoFijo() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    if (user) {
      this.firebaseSvc.getIngFijo(user.uid).subscribe({
        next: (res: any[]) => {
          console.log(res);
          this.ingfijo = res;
  
          if (this.ingfijo.length > 0) {
            // Ordenar la lista por fecha en orden descendente
            this.ingfijo.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  
            // Asignar a ingfijofinal el monto del elemento más reciente
            this.ingfijofinal = Number(this.ingfijo[0].monto);
          } else {
            this.ingfijofinal = 0; // Asignar un valor predeterminado si la lista está vacía
          }
          console.log(this.ingfijofinal);
        },
        error: (err) => {
          console.error('Error fetching ingreso fijo:', err);
        }
      });
    }
  }
  

  // Obtener Meta desde Firebase
  getMeta() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    if (user) {
      this.firebaseSvc.getMeta(user.uid).subscribe({
        next: (res: any[]) => {
          console.log(res);
          this.meta = res;
  
          if (this.meta.length > 0) {
            // Ordenar la lista por fecha en orden descendente
            this.meta.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            
            // Asignar a ingfijofinal el monto del elemento más reciente
            this.metafinal = Number(this.meta[0].monto);
            console.log(this.metafinal);
          } else {
            this.metafinal = 0; // Asignar un valor predeterminado si la lista está vacía
          }
          console.log(this.metafinal);
        },
        error: (err) => {
          console.error('Error fetching ingreso fijo:', err);
        }
      });
    }
  }
  
  

  // Cerrar Sesión
  signOut() {
    this.firebaseSvc.signOut();
  }

  // Añadir Gasto
  async addGasto() {
    const modal = await this.modalController.create({
      component: AddUpdateGastoComponent,
      cssClass: 'add-update-modal'
    });
    return await modal.present();
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