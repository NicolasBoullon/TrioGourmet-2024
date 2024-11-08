import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonIcon, IonItem, IonButton, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline } from 'ionicons/icons';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RouterLink } from '@angular/router';
import { DatabaseService } from 'src/app/core/services/database.service';
import { firstValueFrom } from 'rxjs';

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
    HeaderComponent,
    RouterLink
  ]
})
export class LoginPage {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)
  private _databaseService = inject(DatabaseService);
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
        const resp = await this._authService.signIn(this.form.value.email!, this.form.value.password!);
        if(resp.user.displayName == 'cliente' && resp.user.email){
          const user = await firstValueFrom(this._databaseService.getDocumentById('clientes',resp.user.email));
          if(user.aprobado){
            this._notificationService.routerLink('/home');
            this.form.reset();
          }else{
            this._notificationService.presentToast('¡Alerta: Tu cuenta no ha sido aprobada!', 2000, 'danger', 'bottom');
            this.form.reset();
          }
        }else{
          this.form.reset();
          this._notificationService.routerLink('/home');
        }
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
