import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-gasto',
  templateUrl: './add-update-gasto.component.html',
  styleUrls: ['./add-update-gasto.component.scss'],
})
export class AddUpdateGastoComponent implements OnInit {

  @Input() label: string;
  @Input() control: FormControl;

  form = new FormGroup({
    descripcion: new FormControl('', [Validators.required, Validators.minLength(3)]),
    categoria: new FormControl('', [Validators.required]),
    monto: new FormControl('', [Validators.required, Validators.min(0)]),
    fecha: new FormControl(new Date().toISOString().substring(0, 10), [Validators.required]),
  });

  user: User;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user') as User;

    this.form.controls.fecha.setValue(new Date().toISOString().substring(0, 10));
  }

  async submit() {
    if (this.form.valid) {
      const path = `users/${this.user.uid}/gastos`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Gasto ingresado',
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
}
