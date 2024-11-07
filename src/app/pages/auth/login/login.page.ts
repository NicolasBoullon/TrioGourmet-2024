import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonIcon, IonItem, IonButton, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline } from 'ionicons/icons';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    ReactiveFormsModule,
    IonLabel,
    IonInput,
    IonIcon,
    IonItem,
    IonButton,
    HeaderComponent
  ]
})
export class LoginPage {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)

  showPassword: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor() { 
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline });
  }

  showOrHidePassword() : void {
    this.showPassword = !this.showPassword;
  }

  async submit() : Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Iniciando sesión...');
      try {
        await this._authService.signIn(this.form.value.email!, this.form.value.password!);
        this.form.reset();
        this._notificationService.routerLink('/home');
      } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
          this._notificationService.presentToast('¡Error: Usuario y/o contraseña incorrectos!', 2000, 'danger', 'bottom');
        } else {
          this._notificationService.presentToast('Error inesperado: ' + error.code, 2000, 'danger', 'bottom');
        }
      } finally {
        this._notificationService.dismissLoading();
      }
    }
  }

  quickLogin(email: string, password: string) : void {
    this.form.setValue({ email, password });
  }

}
