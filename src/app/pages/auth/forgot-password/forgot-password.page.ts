import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonIcon, IonItem, IonButton, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, arrowForward } from 'ionicons/icons';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [
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
export class ForgotPasswordPage {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  constructor() {
    addIcons({ mailOutline, arrowForward });
  }

  async submit() : Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Enviando correo...');
      try {
        await this._authService.sendRecoveryEmail(this.form.value.email!);
        this.form.reset();
        this._notificationService.presentToast('¡Correo enviado, revisa tu bandeja de entrada!', 2000, 'success', 'bottom');
        this._notificationService.routerLink('/login');
      } catch (error: any) {
        this._notificationService.presentToast('¡Error: No se pudo enviar el correo!', 2000, 'danger', 'bottom');
      } finally {
        this._notificationService.dismissLoading();
      }
    }
  }

}
