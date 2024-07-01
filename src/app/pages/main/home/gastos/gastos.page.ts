import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Gasto } from 'src/app/models/gastos.model';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {

  @Input() label: string;
  @Input() control: FormControl;

  form = new FormGroup({
    descripcion: new FormControl('', [Validators.required, Validators.minLength(3)]),
    categoria: new FormControl('', [Validators.required]),
    monto: new FormControl('', [Validators.required, Validators.min(0)]),
    fecha: new FormControl(new Date().toISOString(), [Validators.required]),
  });

  user: User;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user') as User;

    this.form.controls.fecha.setValue(new Date().toISOString());
  }

  async submit() {
    if (this.form.valid) {
      if (this.user) this.addGasto();
      else this.updateGasto();
    }
  }

  async addGasto() {
    let path = `users/${this.user.uid}/gastos`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Gasto añadido',
        duration: 1500,
        color: 'warning',
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

  async updateGasto() {
    let path = `users/${this.user.uid}/gastos`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Gasto actualizado',
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
