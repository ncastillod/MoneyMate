import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Ing_fijo, MetaAhorro } from 'src/app/models/config.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @Input() label: string;
  @Input() control: FormControl;


  ingresoFijo: number;
  MetaAhorro: number;
  id: string = '0';
  id1: string = '1';


  form = new FormGroup({
    
    monto: new FormControl('', [Validators.required, Validators.min(0)]),
    fecha: new FormControl(new Date().toISOString(), [Validators.required]),
  });

  formMeta = new FormGroup({
    
    monto: new FormControl('', [Validators.required, Validators.min(0)]),
    fecha: new FormControl(new Date().toISOString(), [Validators.required]),
  });

  user: User;
  ingreso: Ing_fijo;
  meta: MetaAhorro;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user') as User;


    this.form.controls.fecha.setValue(new Date().toISOString());
    this.formMeta.controls.fecha.setValue(new Date().toISOString());
  }


  async submit() {
    if (this.form.valid) {
      if (this.ingreso) this.updateIngreso();
      else this.addIngreso();
    }
  }
  async submitMeta() {
    if (this.formMeta.valid) {
      if (this.meta) this.updateMeta();
      else this.addMeta();
    }
  }



  async addIngreso() {

    let path = `users/${this.user.uid}/ing_fijo`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Ingreso fijo establecido',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }


  async updateIngreso() {

    let path = `users/${this.user.uid}/ing_fijo`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Ingreso fijo actualizado',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }


  async addMeta() {

    let path = `users/${this.user.uid}/meta`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.addDocument(path, this.formMeta.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Meta establecida',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }


  async updateMeta() {

    let path = `users/${this.user.uid}/meta`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.setDocument(path, this.formMeta.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Meta Actualizada',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}