import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { RouterLink } from '@angular/router';
import { AddUpdateGastoComponent } from 'src/app/shared/components/add-update-gasto/add-update-gasto.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);



  ngOnInit() {
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


}
