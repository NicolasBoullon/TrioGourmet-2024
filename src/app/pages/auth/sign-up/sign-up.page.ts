import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonIcon, IonItem, IonButton, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline, personOutline, personAddOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
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
export class SignUpPage {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)

  showPassword: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  })

  constructor() { 
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline, personOutline, personAddOutline });
  }

  showOrHidePassword() : void {
    this.showPassword = !this.showPassword;
  }

  async submit() : Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Creando cuenta...', 1500);
      try {
        await this._authService.signUp(this.form.value.email!, this.form.value.password!, this.form.value.name!);
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
