import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonIcon, IonItem, IonButton, IonText } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { addIcons } from 'ionicons';
import { camera, cameraOutline, eyeOffOutline, eyeOutline, lockClosedOutline, logInOutline, mailOutline, personAddOutline, personOutline, qrCodeOutline } from 'ionicons/icons';


@Component({
  selector: 'app-cliente-sign-up',
  templateUrl: './cliente-sign-up.page.html',
  styleUrls: ['./cliente-sign-up.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent, 
    ReactiveFormsModule,
    IonLabel,
    IonInput,
    IonIcon,
    IonItem,
    IonButton,
    IonText,
    HeaderComponent
  ]
})
export class ClienteSignUpPage  {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)

  showPassword: boolean = false;
  //nombre apellido dni y foto. Opcion de leer QR
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z ]+$')]),
    apellido: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    dni: new FormControl('', [Validators.required, Validators.min(10000000), Validators.max(9999999),Validators.pattern('^[0-9]+$')]),
    image: new FormControl('', [Validators.required]),
  })

  constructor() { 
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline, personOutline, personAddOutline,cameraOutline,qrCodeOutline});
  }

  showOrHidePassword() : void {
    this.showPassword = !this.showPassword;
  }

  async submit() : Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Creando cuenta...', 1500);
      try {
        // await this._authService.signUp(this.form.value.email!, this.form.value.password!, this.form.value.name!);
        this._notificationService.presentToast('¡Cuenta creada!', 1000, 'success', 'middle');
        this.form.reset();
        this._notificationService.routerLink('/home');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          this._notificationService.presentToast('¡Error: El correo ya está registrado!', 2000, 'danger', 'middle');
        } else {
          this._notificationService.presentToast('¡Error: No se pudo crear la cuenta!', 2000, 'danger', 'middle');
        }
      } finally {
        this._notificationService.dismissLoading();
      }
    }
  }

}
